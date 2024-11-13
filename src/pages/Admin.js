import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import {
    collection,
    getDoc,
    getDocs,
    doc,
    setDoc,
    onSnapshot,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import "./Admin.css";

const Admin = () => {
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [currentFmcid, setCurrentFmcid] = useState(0);
    const [timer, setTimer] = useState(60); // Initial timer value
    const [currentBidData, setCurrentBidData] = useState({
        team_id: "N/A",
        playercurrentbidpoint: 0,
        isClosed: false,
        winner: "N/A",
        winningBid: 0,
    });

    const timerRef = useRef(null); // Reference to store the timer interval

    useEffect(() => {
        // Clear previous interval and start a new one when timer resets
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimer((prevTimer) => {
                const newTimer = prevTimer > 0 ? prevTimer - 1 : 0;

                // Update timer in Firestore
                const currentBidRef = doc(db, "bids", "currentBid");
                updateDoc(currentBidRef, { time: newTimer }).catch(console.error);

                if (newTimer <= 0) {
                    clearInterval(timerRef.current);
                }

                return newTimer;
            });
        }, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(timerRef.current);
    }, [currentPlayer]); // Reset timer every time `currentPlayer` changes

    const closeBid = async () => {
        const { team_id, playercurrentbidpoint } = currentBidData;
        if (team_id === "N/A" || !currentPlayer) {
            alert("No active bid to close or missing team ID.");
            return;
        }

        try {
            const teamDocRef = doc(db, "teams", team_id);
            const teamSnapshot = await getDoc(teamDocRef);

            if (teamSnapshot.exists()) {
                const teamData = teamSnapshot.data();
                const currentMaxBidPoint = teamData.maxbidpoint || 0;
                const newMaxBidPoint = currentMaxBidPoint - playercurrentbidpoint;

                if (newMaxBidPoint < 0) {
                    alert("The bid point exceeds the team's available maxbidpoint.");
                    return;
                }

                await updateDoc(teamDocRef, {
                    maxbidpoint: newMaxBidPoint,
                    players: arrayUnion(currentPlayer.fmcid),
                });

                const playerDocRef = doc(db, "users", currentPlayer.id);
                await updateDoc(playerDocRef, {
                    isBidded: true,
                });

                await updateDoc(doc(db, "bids", "currentBid"), {
                    isClosed: true,
                    winner: team_id,
                    winningBid: playercurrentbidpoint,
                });

                alert(
                    `Bid closed for player ${currentPlayer.name}, assigned to team ${team_id}, and ${playercurrentbidpoint} deducted from team's max bid points.`
                );

                setCurrentPlayer(null); // Reset current player after closing bid
            } else {
                alert("Team not found.");
            }
        } catch (error) {
            console.error("Error closing bid:", error);
            alert("Failed to close bid.");
        }
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            const playerSnapshot = await getDocs(collection(db, "users"));
            const fetchedPlayers = playerSnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter(
                    (player) =>
                        player.isBidded !== true &&
                        !["Owner", "Icon Player", "Legend Player"].includes(
                            player.player_type
                        )
                )
                .sort((a, b) => a.fmcid - b.fmcid);
            setPlayers(fetchedPlayers);
        };
        fetchPlayers();

        const unsubscribe = onSnapshot(doc(db, "bids", "currentBid"), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const bidData = docSnapshot.data();
                setCurrentBidData({
                    team_id: bidData.team_id || "N/A",
                    playercurrentbidpoint: bidData.playercurrentbidpoint || 0,
                    isClosed: bidData.isClosed || false,
                    winner: bidData.winner || "N/A",
                    winningBid: bidData.winningBid || 0,
                });
                if (bidData.time) {
                    setTimer(bidData.time); // Update timer from Firestore
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const nextPlayer = async () => {
        const currentBidRef = doc(db, "bids", "currentBid");
        setTimer(60); // Reset timer to 60 seconds
    
        if (!players || players.length === 0) {
            alert("No players available.");
            return;
        }
    
        const remainingFmcids = players
            .map((player) => player.fmcid)
            .filter((fmcid) => fmcid > currentFmcid);
    
        for (const fmcid of remainingFmcids) {
            const nextPlayer = players.find((player) => player.fmcid === fmcid);
    
            if (nextPlayer) {
                setCurrentPlayer(nextPlayer);
                setCurrentFmcid(fmcid);
    
                const playerData = {
                    playerId: nextPlayer.id || "",
                    playerName: nextPlayer.name || "Unknown Player",
                    playerFmcid: fmcid,
                    playerJerseynumber: nextPlayer.jersey_number || "Unknown Team",
                    playerShirtsize: nextPlayer.shirt_size || "Unknown Player",
                    playerMobilenumber: nextPlayer.mobile_number || "Unknown Position",
                    playerType: nextPlayer.player_type || "Unknown Team",
                    playerPayment: nextPlayer.payment || "Unknown Team",
                    playerAddress: nextPlayer.address || "Unknown Team",
                    Playerphotourl: nextPlayer.photo_url || "https://via.placeholder.com/150",
                    playercurrentbidpoint: 0,
                    isClosed: false,
                    winner: "N/A",
                    winningBid: 0,
                    time: 60,
                };
    
                try {
                    await setDoc(currentBidRef, playerData);
                } catch (error) {
                    console.error("Failed to update current bid:", error);
                }
                return;
            }
        }
    
        alert("No more players available.");
    };
    
    

    return (
        <div className="admin-container">
            <h2>Admin Panel</h2>

            <div className="current-bid-info">
                <p><strong>Current Bidding Team ID:</strong> {currentBidData.team_id}</p>
                <p><strong>Current Bid Point:</strong> {currentBidData.playercurrentbidpoint}</p>
                <p><strong>Bid Status:</strong> {currentBidData.isClosed ? "Closed" : "Open"}</p>
                {currentBidData.isClosed && (
                    <>
                        <p><strong>Winning Team:</strong> {currentBidData.winner}</p>
                        <p><strong>Winning Bid:</strong> {currentBidData.winningBid}</p>
                    </>
                )}
                <p><strong>Time remaining:</strong> {timer} seconds</p>
            </div>

            <button className="next-player-btn" onClick={nextPlayer}>
                Next Player
            </button>

            <button className="close-bid-btn" onClick={closeBid} disabled={!currentPlayer || currentBidData.isClosed}>
                Close Bid
            </button>

            {currentPlayer ? (
                <div className="player-card">
                    <img
                        src={currentPlayer.photo_url || "https://via.placeholder.com/150"}
                        alt={currentPlayer.name}
                        className="player-image"
                    />
                    <div className="player-details">
                        <h3>{currentPlayer.name}</h3>
                        <h4>Time remaining <strong>{timer}</strong> seconds</h4>
                        <p><strong>Player ID:</strong> {currentPlayer.fmcid}</p>
                        <p><strong>Mobile number:</strong> {currentPlayer.mobile_number}</p>
                        <p><strong>Address:</strong> {currentPlayer.address}</p>
                        <p><strong>Jersey No :</strong> {currentPlayer.jersey_number}</p>
                        <p><strong>Shirt Size:</strong> {currentPlayer.shirt_size}</p>
                        <p><strong>Player Type:</strong> {currentPlayer.player_type}</p>
                    </div>
                </div>
            ) : (
                <p>Waiting for the admin to select a player for bidding...</p>
            )}
        </div>
    );
};

export default Admin;