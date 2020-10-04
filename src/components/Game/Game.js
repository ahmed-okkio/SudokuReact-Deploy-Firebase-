import React, {useState, useEffect} from 'react';
import classes from '../../CSS/GameStyle.module.css';
import LogicContainers from './GridComponents/LogicContainers';
import GridOverlay  from './GridComponents/GridOverlay';
import InputPad from './GridComponents/Input';
import padContext from '../Context/Pad-context';
import Solve from '../Buttons/Solve';
import Finish from'../Buttons/Finish';
import puzzleData from '../../Assets/data.json';
import fire from '../Login/fire';
import { useHistory } from 'react-router-dom';
const Game = (props) =>{
    const [Padstate,setPadstate] = useState({
        showPad:false,
        Xcoords: null,
        Ycoords:null,
        cellindex: null
    })
    const  [ActivePuzzle,SetPuzzle] = useState({
        R1:[null,null,null,null,null,null,null,null,null],
        R2:[null,null,null,null,null,null,null,null,null],
        R3:[null,null,null,null,null,null,null,null,null],
        R4:[null,null,null,null,null,null,null,null,null],
        R5:[null,null,null,null,null,null,null,null,null],
        R6:[null,null,null,null,null,null,null,null,null],
        R7:[null,null,null,null,null,null,null,null,null],
        R8:[null,null,null,null,null,null,null,null,null],
        R9:[null,null,null,null,null,null,null,null,null]});
    const [puzzCompState,setPuzzComp] = useState({complete:0});
    const [triggerCheck,setTrigger] = useState({trigger:false,state:false});
    const [puzzleCorrect,setPuzzleCorrect] = useState(false);
    const [puzzleID,setPuzzleID] = useState('');
    const puzzleFinish =()=>{
        let temp = 0
        Object.keys(ActivePuzzle).map((Sector,key)=>{
            for(let i = 0;i<ActivePuzzle[Sector].length;i++){
                let row = ActivePuzzle[Sector][i]
                if(row !== 0 && row !== null){
                    temp++
                    
                }
            }
        })
        setPuzzComp({complete:temp})
        let temp2 = triggerCheck.trigger
        setTrigger({trigger:!temp2,
            state:true
        })
    }  
    const PadHandler =(event, stat, Sector,index)=>{
        if(Padstate.showPad||stat=="static"){
            setPadstate({
                showPad:false
            });
        }
        else{    
            setPadstate({
                showPad:true,
                Xcoords: event.clientX,
                Ycoords: event.clientY,
                cellindex: index,
                Sector: Sector
            })
        }
    }
    const InputHandler=(padinput)=>{
        let Tempstate = ActivePuzzle
        Tempstate[Padstate.Sector][Padstate.cellindex]= padinput.toString()

        SetPuzzle(Tempstate)
        setPadstate({
            showPad:false
        })
 
    }
    let history = useHistory();
    const endPuzzle=()=>{
        setPuzzleCorrect(true)
        props.gameHandler()
        // 
       
    }
    let inputmenu = null;
    if(Padstate.showPad){
        inputmenu = (
        <InputPad InputHandler={InputHandler}Ycoords={Padstate.Ycoords} Xcoords={Padstate.Xcoords}/>
        );
    }
    
    
    
    let   GameComponents = (
        <div >
            {Object.keys(ActivePuzzle).map((Sector,key)=>{
                return(
                    <LogicContainers start={props.gameState} {...Padstate} PadHandler={PadHandler}Data={ActivePuzzle[Sector]} Sector={Sector}key={key}/>
                )
            })}

        </div>
    )
    const PuzzleLoader = ()=>{
        let tempcounter = 0
        let RawPuzzle  = null;
        let i = Math.floor((Math.random() * 500) + 1)
        RawPuzzle = puzzleData[i]["puzzle"].toString()
        setPuzzleID(RawPuzzle.substring(0,6))
        let PuzzProcess = RawPuzzle.split("")
        let ReadyPuzz ={
            R1:[],
            R2:[],
            R3:[],
            R4:[],
            R5:[],
            R6:[],
            R7:[],
            R8:[],
            R9:[]}  
        for(let n = 1; n <10;n++){    
            for(let i =0;i<9;i++){
                ReadyPuzz["R"+n].push(parseInt(PuzzProcess[tempcounter]))
                tempcounter++ 
              }           
          }
        SetPuzzle(ReadyPuzz)
    }
    useEffect(()=>{
        if(props.gameState){
        PuzzleLoader()
    }
    
    },[props.gameState])
    useEffect(()=>{
        if(puzzleCorrect){
            fire.auth().onAuthStateChanged(user => {
                if(user != null){
                    return fire.firestore().collection('users-history').doc(user.email)
                
                .get()
                .then((doc)=>{
                    fire.firestore().collection('users-history').doc(user.email)
                    .update({
                        [puzzleID]:parseInt(1000 / props.score),
                        highScore:doc.data().highScore+parseInt(1000 / props.score)
                        
                })
            }).then(()=>{
                history.push("/Complete")
            })
        }
    else{
        history.push("/Complete")
    }})
    }
    },[props.score])
    let StartFin = <Solve onClick={props.gameHandler} gameState={props.gameState}></Solve>
    if(props.gameState){
      StartFin= <Finish 
        onClick={puzzleFinish}
        endPuzzle={endPuzzle}
        triggstate={triggerCheck.state}
        trigger={triggerCheck.trigger}
        puzzleComplete={puzzCompState.complete}
        Puzzle={ActivePuzzle}
        score={props.score}/>
    }
    return(
        <div >
            
            <div className={classes.GameStyleContainer} >
                <GridOverlay/>
                <padContext.Provider value={{showPad: Padstate.showPad, PadHandler:PadHandler}}>
                <div className={classes.GameContainer}>
                    {GameComponents}
                </div>
                </padContext.Provider>
            </div>
            {inputmenu}
            {StartFin}
        </div>
    )
};
export default Game;