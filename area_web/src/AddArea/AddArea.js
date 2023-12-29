import React, { useState, useEffect } from "react";
import style from "./AddArea.module.css";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/joy/Checkbox";

import discord from "../assets/DiscordLogo.png";
import trello from "../assets/TrelloLogo.png";
import github from "../assets/GithubLogo.png";
import x from "../assets/Logo_AREA.png";

import Popup from "../Components/PopupInfosCard";
import { API_URL, IconRouter } from "../utils";

function ListItemsChooseReaction({ item, setReactions, reactions }) {
    const [checkedState, setCheckedState] = useState(
        item.reactions.map((i) => {
            return { status: false, code: i.code, name : i.displayName};
        })
    );

    const handleCheckboxChange = (index) => {
        // const updatedCheckedState = checkedState.map((item, idx) =>
        //     idx === index ? {'status' : !item.status, 'code' : item.code} : item

        // );

        let elem = null;
        let newCheckedState = checkedState;
        for (let i = 0; i < newCheckedState.length; i++) {
            if (i === index) {
                newCheckedState[i].status = !newCheckedState[i].status;
                elem = newCheckedState[i];
                break;
            }
        }
        setCheckedState(newCheckedState);

        if (elem === null) return;

        if (elem.status === false) {
            let newReactions = [];
            for (let i = 0; i < reactions.length; i++) {
                if (reactions[i].reaction !== elem.code) {
                    newReactions.push(reactions[i]);
                }
            }
            setReactions(newReactions);
            return;
        }
        setReactions([...reactions, { app: item.app, reaction: elem.code, name : elem.name }]);
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'Enter') {
            handleCheckboxChange(index);
        }
    };

    return (
        <div className={style.listItemContainer}>
            <div className={style.headerRowList}>
                <img
                    src={item.icon}
                    alt={item.app}
                    className={style.listItemLogo}
                />
                {item.app}
            </div>

            {item.reactions.map((reaction, index) => (
                <div
                    className={
                        index === 0
                            ? style.bodyListItemFirst
                            : index === item.reactions.length - 1
                            ? style.bodyListItemLast
                            : style.bodyListItem
                    }
                    key={index}
                    onClick={() => handleCheckboxChange(index)}
                >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src={item.icon}
                            alt={item.app}
                            className={style.listItemLogo}
                        />
                        <span>{reaction.displayName}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Checkbox checked={checkedState[index].status} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ListItemsChooseAction({
    item,
    setProgression,
    setSelectedAction,
    setSelectedActionLogo,
}) {
    const handleClick = (action) => {
        let actionOut = {
            code: action.code,
            displayName: action.displayName,
            app: item.app,
        };
        setSelectedAction(actionOut);
        setSelectedActionLogo(item.icon);
        setProgression(1);
    };

    const handleKeyDown = (event, actionName) => {
        if (event.key === 'Enter') {
            handleClick(actionName);
        }
    };

    return (
        <div className={style.listItemContainer}>
            <div className={style.headerRowList}>
                <img
                    src={item.icon}
                    alt={item.app}
                    className={style.listItemLogo}
                />
                {item.app}
            </div>

            {item.actions.map((action, index) => (
                <div
                    className={
                        index === 0
                            ? style.bodyListItemFirst
                            : index === item.actions.length - 1
                            ? style.bodyListItemLast
                            : style.bodyListItem
                    }
                    // onKeyDown={(event) => handleKeyDown(event, action.actionName)}
                    // tabIndex={0} // Permet la navigation au clavier
                    key={index}
                    onClick={() => handleClick(action)}
                >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src={item.icon}
                            alt={item.app}
                            className={style.listItemLogo}
                        />
                        <span>{action.displayName}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <ChevronRightIcon />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AddArea() {
    const [open, setOpen] = useState(false);
    const [progression, setProgression] = useState(0);
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedActionLogo, setSelectedActionLogo] = useState(null);
    const [reactions, setReactions] = useState([]);

    const [areas, setAreas] = useState([]);

    useEffect(() => {
        fetch(API_URL + "/api/services", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt"),
            },
        })
            .then((response) => response.json())
            .then(async (data) => {
                let newData = []
                if (window.user && window.user.connected) {
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < window.user.connected.length; j++) {
                            if (data[i].app === window.user.connected[j]) {
                                data[i].icon = IconRouter(data[i].app);
                                newData.push(data[i])
                            }
                        }
                    }
                }
                setAreas(newData);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [window.user]);

    const toggleOpen = () => {
        setOpen(!open);
        setReactions([]);
        setSelectedAction(null);
    };

    const handleSubmit = () => {
        fetch(API_URL + "/api/area", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                action: selectedAction.code,
                reactions: reactions,
                app: selectedAction.app,
            }),
        })
            .then((response) => response.json())
            .then(async (data) => {
                setOpen(!open);
                setReactions([]);
                setSelectedAction(null);
                setProgression(0);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const goBack = () => {
        setReactions([]);
        setSelectedAction(null);
        setProgression(0)
    }

    return (
        <>
            <div className={style.buttonAddArea}>
                <IconButton
                    aria-label="addArea"
                    size="large"
                    style={{ backgroundColor: "#0000FF", color: "#FFF" }}
                    onClick={toggleOpen}
                >
                    <AddIcon fontSize="inherit" />
                </IconButton>
            </div>
            {open && (
                <Popup
                    name={
                        progression === 0 ? "Add an action" : "Add a reaction"
                    }
                    open={open}
                    setOpen={setOpen}
                    onClose={toggleOpen}
                >
                    {progression === 0 && (
                        <div className={style.gridList}>
                            {areas &&
                                areas.map((item, index) => (
                                    <ListItemsChooseAction
                                        key={index}
                                        item={item}
                                        setProgression={setProgression}
                                        setSelectedAction={setSelectedAction}
                                        setSelectedActionLogo={
                                            setSelectedActionLogo
                                        }
                                    />
                                ))}
                        </div>
                    )}
                    {progression === 1 && (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100%",
                                    alignContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <button
                                    className={style.buttonBack}
                                    onClick={goBack}
                                >
                                    <ChevronLeftIcon />
                                </button>
                                <span className={style.actionSelected}>
                                    <img
                                        src={selectedActionLogo}
                                        alt={selectedAction.displayName}
                                        className={style.listItemLogo}
                                    />{" "}
                                    {selectedAction.displayName}
                                </span>
                            </div>
                            <div className={style.gridList}>
                                {areas &&
                                    areas.map((item, index) => (
                                        <ListItemsChooseReaction
                                            key={index}
                                            item={item}
                                            setProgression={setProgression}
                                            setReactions={setReactions}
                                            reactions={reactions}
                                        />
                                    ))}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100%",
                                    alignContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <button
                                    className={style.buttonSubmitAddArea}
                                    onClick={handleSubmit}
                                >
                                    <b>Submit</b>
                                </button>
                            </div>
                        </>
                    )}
                </Popup>
            )}
        </>
    );
}
