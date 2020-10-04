import React, { useEffect, useState } from 'react';
import classes from '../../CSS/Rankings.module.css';
import fire from '../Login/fire';

const Rankings = () => {
    let playerdata = [];
    const [rawPlayerData, setRawPlayerData] = useState([])
    const [playerDataState, setPlayerDataState] = useState()
    const [LoadTemp, setLoadTemp] = useState({ opacity: 0, trans: 0.5 })
    const displayScores = () => {
        let temp = rawPlayerData;
        temp.sort((a, b) => (a[1] > b[1] ? 1 : -1))
        temp.map((list, key) => {
            return(
                playerdata.push(
                <ul key={key} className={classes.player}>
                    <li  className={classes.Place}>{key + 1}</li>
                    <li className={classes.Name}>{list[0]}</li>
                    <li className={classes.Score}>{list[1]}</li>
                </ul>
            )
            )

        })
        setPlayerDataState(playerdata)
    }
    useEffect(() => {
        let rawPlayerData = [];
        fire.firestore().collection('users-history').get()
            .then((docs) => {
                docs.forEach(doc => {
                    console.log(doc)
                    let name = doc.id.split('@')
                    rawPlayerData.push([name[0], doc.data().highScore])
                })
                setRawPlayerData(rawPlayerData)
            });

        setTimeout(() => {
            setLoadTemp({ opacity: 1, trans: 0.5 })
        }, 500)
        setTimeout(() => {
            setLoadTemp({ trans: "none" })
        }, 1000)

    }, [])
    useEffect(() => {
        displayScores()
    }, [rawPlayerData])
    return (
        <div className={classes.rankings} style={{ opacity: `${LoadTemp.opacity}`, transition: `${LoadTemp.trans}s` }}>
            <div className={classes.board}>
                <ul className={classes.boardsep}>
                    <li className={classes.leftsep}></li>
                    <li className={classes.rightsep}></li>
                </ul>
                <ul className={classes.headings}>
                    <li>RANK</li>
                    <li>NAME</li>
                    <li>POINTS</li>
                </ul>
                {playerDataState}
            </div>
        </div>
    )
}
export default Rankings                     