import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import "./Publicc.css";

const PubliccDisplay = () => {
    const [currentBidData, setCurrentBidData] = useState({
        team_id: "N/A",
        playercurrentbidpoint: 0,
        isClosed: false,
        winner: "N/A",
        winningBid: 0,
    });
    const [teamName, setTeamName] = useState("N/A");
    const [timer, setTimer] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(null);

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
                if (bidData.playerId) {
                    const playerRef = doc(db, "users", bidData.playerId);
                    getDoc(playerRef).then((playerDoc) => {
                        if (playerDoc.exists()) {
                            setCurrentPlayer(playerDoc.data());
                        }
                    });
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (timer === 0) {
            const currentBidRef = doc(db, "bids", "currentBid");
            updateDoc(currentBidRef, { time: 0 }).catch(console.error);
            return;
        }

        const timerInterval = setInterval(() => {
            setTimer((prevTimer) => {
                const newTimer = prevTimer > 0 ? prevTimer - 1 : 0;
                const currentBidRef = doc(db, "bids", "currentBid");
                updateDoc(currentBidRef, { time: newTimer }).catch(console.error);
                return newTimer;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timer]);

    return (
        <div className="kpl-container">
            <div className={`kpl-background ${timer <= 10 ? "warning-mode" : ""}`}>
                {currentBidData.isClosed ? (
                    <div className="winning-overlay">
                        <h1 className="winner-announcement">🏆 Winner 🏆</h1>
                        <h2>Team: {currentBidData.winner}</h2>
                        <h2>Winning Bid: {currentBidData.winningBid}</h2>
                    </div>
                ) : (
                    <>
                        <div className="timer-container">
                            <div className={`timer-circle ${timer <= 10 ? "blinking-red" : ""}`}>
                                {timer}
                            </div>
                        </div>
                        <div className="bid-info">
                            <h3 className="team-name">Team: {teamName}</h3>
                            <h3 className="bid-points">Bid Points: {currentBidData.playercurrentbidpoint}</h3>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default PubliccDisplay;
