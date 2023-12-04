import style from "./HomePage.module.css";
import React from 'react';

import Topbar from "../Topbar/Topbar";
import HorizontalList from "../HorizontalList/HorizontalList";
import AddArea from "../AddArea/AddArea";

export default function Home() {

    return (
        <div className={style.MainContainerHomePage}>
            <div className={style.topbarContainer}>
                <Topbar />
            </div>
            <div className={style.horizontalListContainer}>
                <HorizontalList />
            </div>
            <AddArea />
            <div style={{margin:'10px', padding:'10px', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', flexDirection:'column'}}>
                <span style={{margin:'5px'}} >© 2023 - All rights reserved</span>
                <span style={{margin:'5px', color:'#0000FF', cursor:'pointer'}} >legal mentions</span>
            </div>
        </div>
    );
}
