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
    const [timer, setTimer] = useState(0);
    const [currentBidData, setCurrentBidData] = useState({
        team_id: "N/A",
        playercurrentbidpoint: 0,
        isClosed: false,
        winner: "N/A",
        winningBid: 0,
    });
    const [teamName, setTeamName] = useState("N/A");
    const [showWinnerScreen, setShowWinnerScreen] = useState(false);
    const [showMaxBidPoints, setShowMaxBidPoints] = useState(false); // State for showing max bid points in-page
    const [teamsMaxBidPoints, setTeamsMaxBidPoints] = useState([]); // State to store teams' max bid points

    const timerRef = useRef(null);

    useEffect(() => {
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

        return () => clearInterval(timerRef.current);
    }, [currentPlayer]);

    useEffect(() => {
        if (currentBidData.team_id !== "N/A") {
            const fetchTeamName = async () => {
                const teamRef = doc(db, "teams", currentBidData.team_id);
                const teamSnapshot = await getDoc(teamRef);
                if (teamSnapshot.exists()) {
                    setTeamName(teamSnapshot.data().team_name || "Unknown Team");
                } else {
                    setTeamName("N/A");
                }
            };
            fetchTeamName();
        }
    }, [currentBidData.team_id]);

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
                    setTimer(bidData.time);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // const nextPlayer = async () => {
    //     setShowWinnerScreen(false); // Hide winner screen on the next player
    //     setShowMaxBidPoints(false); // Hide max bid points on next player
    //     const currentBidRef = doc(db, "bids", "currentBid");
    //     setTimer(60);

    //     if (!players || players.length === 0) {
    //         alert("No players available.");
    //         return;
    //     }

    //     const remainingFmcids = players
    //         .map((player) => player.fmcid)
    //         .filter((fmcid) => fmcid > currentFmcid);

    //     for (const fmcid of remainingFmcids) {
    //         const nextPlayer = players.find((player) => player.fmcid === fmcid);

    //         if (nextPlayer) {
    //             setCurrentPlayer(nextPlayer);
    //             setCurrentFmcid(fmcid);

    //             const playerData = {
    //                 playerId: nextPlayer.id || "",
    //                 playerName: nextPlayer.name || "Unknown Player",
    //                 playerFmcid: fmcid,
    //                 playerJerseynumber: nextPlayer.jersey_number || "Unknown Team",
    //                 playerShirtsize: nextPlayer.shirt_size || "Unknown Player",
    //                 playerMobilenumber: nextPlayer.mobile_number || "Unknown Position",
    //                 playerType: nextPlayer.player_type || "Unknown Team",
    //                 playerPayment: nextPlayer.payment || "Unknown Team",
    //                 playerAddress: nextPlayer.address || "Unknown Team",
    //                 Playerphotourl: nextPlayer.photo_url || "https://via.placeholder.com/150",
    //                 playercurrentbidpoint: 0,
    //                 isClosed: false,
    //                 winner: "N/A",
    //                 winningBid: 0,
    //                 time: 0,
    //             };

    //             try {
    //                 await setDoc(currentBidRef, playerData);
    //             } catch (error) {
    //                 console.error("Failed to update current bid:", error);
    //             }
    //             return;
    //         }
    //     }

    //     alert("No more players available.");
    // };
    const nextPlayer = async () => {
    setShowWinnerScreen(false); // Hide winner screen on the next player
    setShowMaxBidPoints(false); // Hide max bid points on next player

    const currentBidRef = doc(db, "bids", "currentBid");
    setTimer(60);

    if (!players || players.length === 0) {
        alert("No players available.");
        return;
    }

    // Filter players: exclude those already bidded and those with specific player types
    const filteredPlayers = players
        .filter(
            (player) =>
                player.isBidded !== true &&
                !["Owner", "Icon Player", "Legend Player"].includes(player.player_type)
        )
        .sort((a, b) => {
            // Sorting by player_type in descending order
            const typeOrder = ["Owner", "Icon Player", "Legend Player", "Regular Player"]; // Example player types
            return typeOrder.indexOf(b.player_type) - typeOrder.indexOf(a.player_type);
        });

    // Check if there are no more filtered players to bid on
    const remainingFmcids = filteredPlayers
        .map((player) => player.fmcid)
        .filter((fmcid) => fmcid > currentFmcid);

    // If no remaining players, reset the filtered list and start again
    if (remainingFmcids.length === 0) {
        alert("No more eligible players left. Restarting the player list.");
        
        // Re-filter and sort players again
        const allFilteredPlayers = players
            .filter(
                (player) =>
                    player.isBidded !== true &&
                    !["Owner", "Icon Player", "Legend Player"].includes(player.player_type)
            )
            .sort((a, b) => {
                // Sorting by player_type in descending order
                const typeOrder = ["Owner", "Icon Player", "Legend Player", "Regular Player"];
                return typeOrder.indexOf(b.player_type) - typeOrder.indexOf(a.player_type);
            });

        // If there are no available players at all after re-filtering, alert and stop
        if (allFilteredPlayers.length === 0) {
            alert("No players left to bid on.");
            return;
        }

        // Start bidding with the first eligible player in the re-filtered list
        const firstPlayer = allFilteredPlayers[0];
        setCurrentPlayer(firstPlayer);
        setCurrentFmcid(firstPlayer.fmcid);

        const playerData = {
            playerId: firstPlayer.id || "",
            playerName: firstPlayer.name || "Unknown Player",
            playerFmcid: firstPlayer.fmcid,
            playerJerseynumber: firstPlayer.jersey_number || "Unknown Team",
            playerShirtsize: firstPlayer.shirt_size || "Unknown Player",
            playerMobilenumber: firstPlayer.mobile_number || "Unknown Position",
            playerType: firstPlayer.player_type || "Unknown Team",
            playerPayment: firstPlayer.payment || "Unknown Team",
            playerAddress: firstPlayer.address || "Unknown Team",
            Playerphotourl: firstPlayer.photo_url || "https://via.placeholder.com/150",
            playercurrentbidpoint: 0,
            isClosed: false,
            winner: "N/A",
            winningBid: 0,
            time: 0,
        };

        try {
            await setDoc(currentBidRef, playerData);
        } catch (error) {
            console.error("Failed to update current bid:", error);
        }

        return; // Exit to avoid further code execution
    }

    // Find the next player based on fmcid
    const nextPlayer = filteredPlayers.find((player) => player.fmcid === remainingFmcids[0]);

    if (nextPlayer) {
        setCurrentPlayer(nextPlayer);
        setCurrentFmcid(nextPlayer.fmcid);

        const playerData = {
            playerId: nextPlayer.id || "",
            playerName: nextPlayer.name || "Unknown Player",
            playerFmcid: nextPlayer.fmcid,
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
            time: 0,
        };

        try {
            await setDoc(currentBidRef, playerData);
        } catch (error) {
            console.error("Failed to update current bid:", error);
        }
    }
};

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

                // Show the winner screen after closing the bid
                setShowWinnerScreen(true);

                alert(
                    `Bid closed for player ${currentPlayer.name}, assigned to team ${team_id}, and ${playercurrentbidpoint} deducted from team's max bid points.`
                );
            } else {
                alert("Team not found.");
            }
        } catch (error) {
            console.error("Error closing bid:", error);
            alert("Failed to close bid.");
        }
    };

    const viewMaxBidPoints = async () => {
        try {
            const teamsSnapshot = await getDocs(collection(db, "teams"));
            const teamMaxBidPoints = teamsSnapshot.docs.map((doc) => ({
                teamName: doc.data().team_name,
                maxBidPoint: doc.data().maxbidpoint,
            }));

            setTeamsMaxBidPoints(teamMaxBidPoints); // Store the max bid points in state
            setShowMaxBidPoints(true); // Show the max bid points section
        } catch (error) {
            console.error("Error fetching teams' max bid points:", error);
            alert("Failed to fetch teams' max bid points.");
        }
    };

    return (
        <div className="admin-container">
            {showWinnerScreen ? (
                <div className="winner-screen">
                    <h1>Winner: {teamName}</h1>
                    <h2>Winning Bid: {currentBidData.winningBid}</h2>
                    <div className="winner-actions">
                        <button onClick={nextPlayer} className="next-player-btn">
                            Next FMCID
                        </button>
                        <button onClick={viewMaxBidPoints} className="view-max-bidpoints-btn">
                            View All Teams' Max Bid Points
                        </button>
                    </div>

                    {showMaxBidPoints && (
                        <div className="max-bid-points">
                            <h3>All Teams' Max Bid Points:</h3>
                            <ul>
                                {teamsMaxBidPoints.map((team, index) => (
                                    <li key={index}>
                                        {team.teamName}: {team.maxBidPoint}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={nextPlayer} className="next-player-btn">
                                Next FMCID
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="timer-container">
                        <div
                            className={`timer-circle ${timer <= 10 ? "blinking-red" : ""}`}
                        >
                            {timer}
                        </div>
                    </div>

                    <div className="bid-info">
                        <h3 className="left-align">Team Name: {teamName}</h3>
                        <h3 className="right-align">Bid Points: {currentBidData.playercurrentbidpoint}</h3>
                    </div>

                    {currentPlayer ? (
                        <div className="player-info">
                            <img
                                src={currentPlayer.photo_url || "https://via.placeholder.com/150"}
                                alt={currentPlayer.name}
                                className="player-image"
                            />
                            <h3>{currentPlayer.name}</h3>
                            <p><strong>FMCID:</strong> {currentPlayer.fmcid}</p>
                        </div>
                    ) : (
                        <p>Waiting for the admin to select a player...</p>
                    )}

                    <div className="action-buttons">
                        <button className="next-player-btn" onClick={nextPlayer}>
                            Next Player
                        </button>
                        <button
                            className="close-bid-btn"
                            onClick={closeBid}
                            disabled={!currentPlayer || currentBidData.isClosed}
                        >
                            Close Bid
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Admin;
