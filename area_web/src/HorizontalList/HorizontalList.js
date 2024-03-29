import React, { useState, useEffect } from "react";
import style from "./HorizontalList.module.css";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import IMG from "../assets/IMG....png";
import PopupWoverlay from "../Components/PopupInfosCard";
import { API_URL, IconRouter } from "../utils";

const label = { inputProps: { "aria-label": "Switch demo" } };

function InformationsOnPopup({ item, itemLogo }) {
    const delArea = () => {
        fetch(API_URL + "/api/area", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                id: item.id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.msg === "ok") {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <div className={style.informationsMainContainer}>
            <div className={style.InformationsOnPopupTop}>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <span className={style.InformationsOnPopupAction}>
                        <b>When</b>
                    </span>
                </div>
                <div className={style.informationsOnPopupContainerLogoAndText}>
                    <div
                        className={
                            style.informationsOnPopupSubContainerTopLogoAndText
                        }
                    >
                        <img
                            src={itemLogo}
                            alt={itemLogo}
                            style={{
                                width: "25px",
                                height: "auto",
                                marginRight: "15px",
                            }}
                        />
                        {item.when}
                    </div>
                </div>
            </div>
            <div style={{ width: "90%" }}>
                <span className={style.InformationsOnPopupAction}>
                    <b>Then</b>
                </span>
                <div className={style.informationsOnPopupContainerLogoAndText}>
                    <div
                        className={
                            style.informationsOnPopupSubContainerBottomLogoAndText
                        }
                    >
                        {item &&
                            item.then &&
                            item.then.map((thenItem, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <img
                                        style={{
                                            width: "25px",
                                            height: "auto",
                                            marginRight: "5px",
                                        }}
                                        key={index}
                                        src={thenItem.serviceLogo}
                                        alt={thenItem.serviceLogo}
                                    />
                                    <span>{thenItem.reactionName}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div
                style={{
                    position: "fixed",
                    display: "flex",
                    justifyContent: "center",
                    bottom: "12%",
                    width: "100%",
                    left: "22%",
                }}
            >
                <IconButton
                    size="large"
                    style={{
                        backgroundColor: "#FF0000",
                        color: "#fff",
                        margin: "10px",
                        position: "relative",
                    }}
                    onClick={delArea}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
}

function CardTop({ item, itemLogo, toggleCardActive }) {
    const toggleSwitch = (event) => {
        const newActive = event.target.checked;
        toggleCardActive(item.id, newActive);

        fetch(API_URL + "/api/area", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                id: item.id,
                active: event.target.checked,
            }),
        })
            .then((response) => response.json())
            .then((data) => {})
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter')
            toggleSwitch({ target: { checked: !item.isActive } });
    };

    return (
        <div className={style.cardTop}>
            <div className={style.cardTopSubcontainer1}>
                <span className={style.cardSubtitle}>When</span>
                <div className={style.cardInstructionList}>
                    <img
                        src={itemLogo}
                        alt={itemLogo}
                        style={{ width: "25px", height: "auto" }}
                    />
                    <span className={style.cardInstruction}>{item.when.length > 22 ? `${item.when.slice(0, 22)}...` : item.when}</span>
                </div>
            </div>
            <div className={style.cardTopSubcontainer2}>
                <Switch
                    checked={item.isActive}
                    onChange={toggleSwitch}
                    {...label}
                    onKeyDown={handleKeyDown}
                    sx={{
                        width: 62,
                        height: 40,
                        "& .MuiSwitch-switchBase": {
                            "&.Mui-checked": {
                                transform: "translateX(24px)",
                            },
                        },
                        "& .MuiSwitch-thumb": {
                            width: 24,
                            height: 24,
                        },
                        "& .MuiSwitch-track": {
                            borderRadius: 26 / 2,
                        },
                    }}
                />
            </div>
        </div>
    );
}

function CardBottom({ item, itemLogo }) {
    const [showInformationsCard, setShowInformationsCard] = useState(false);
    const [newThen, setNewThen] = useState([]);

    useEffect(() => {
        let tempNewThen = [];
        if (item && item.then && item.then.length > 5) {
            for (let i = 0; i < 5; i++) {
                tempNewThen.push(item.then[i]);
            }
            tempNewThen.push({
                serviceName: "...",
                serviceLogo: IMG,
            });
        }
        setNewThen(tempNewThen);
    }, [item]);

    const toggleShowInformationsCard = () => {
        setShowInformationsCard(!showInformationsCard);
    };

    return (
        <div className={style.cardBottom}>
            <div className={style.cardTopSubcontainer1}>
                <span className={style.cardSubtitle}>Then</span>
                <div className={style.cardInstructionList}>
                    {newThen.length > 0 ? newThen.map((thenItem, index) => (
                            <img key={index} style={{ width: "25px", height: "auto", marginRight: "5px" }} src={thenItem.serviceLogo} alt={thenItem.serviceName}/>
                        )) : item && item.then && item.then.length === 1 ?
                            <>
                                <img style={{ width: "25px", height: "auto", marginRight: "5px" }} src={item.then[0].serviceLogo} alt={item.then[0].serviceName} />
                                <span className={style.cardInstruction}> {item.then[0].reactionName.length > 25 ? `${item.then[0].reactionName.slice(0, 25)}...` : item.then[0].reactionName} </span>
                            </> : item && item.then && item.then.map((thenItem, index) => (
                            <img key={index} style={{ width: "25px", height: "auto", marginRight: "5px" }} src={thenItem.serviceLogo} alt={thenItem.serviceName} />
                    ))}
                </div>
            </div>
            <div className={style.cardTopSubcontainer3}>
                <IconButton
                    size="large"
                    style={{
                        backgroundColor: "#252525",
                        color: "#fff",
                        margin: "10px",
                    }}
                    onClick={toggleShowInformationsCard}
                >
                    <SettingsIcon />
                </IconButton>
            </div>
            {showInformationsCard && (
                <PopupWoverlay
                    setOpen={setShowInformationsCard}
                    open={showInformationsCard}
                    onClose={toggleShowInformationsCard}
                    name={"Edit AREA"}
                >
                    <InformationsOnPopup item={item} itemLogo={itemLogo} />
                </PopupWoverlay>
            )}
        </div>
    );
}

function Card({ item, itemLogo, toggleCardActive }) {
    if (item === null)
        return (
            <div className={style.cardContainer}>
            </div>
        );
    return (
        <div className={style.cardContainer} key={item.id}>
            <CardTop item={item} itemLogo={itemLogo} toggleCardActive={toggleCardActive} />
            <CardBottom item={item} itemLogo={itemLogo} />
        </div>
    );
}

function ListContainer({ item, toggleCardActive }) {
    const [startIndex, setStartIndex] = useState(0);
    const [displayedCards, setDisplayedCards] = useState([]);

    useEffect(() => {
        if (!item) return;
        if (!item.cardList) return;
        let cardsPerGroup = 3;
        let display = [];
        if (startIndex === 0)
            display.push(null);
        if (startIndex === 0 || startIndex === item.cardList.length - 1)
            cardsPerGroup = 2;
        for (let i = 0; i < cardsPerGroup && i < item.cardList.length; ++i)
            display.push(
                item.cardList[i + startIndex + (startIndex > 0 ? -1 : 0)]
            );
        for (let i = 0; i < 3 - display.length; ++i)
            display.push(null);
        setDisplayedCards(display);
    }, [startIndex, item]);

    const handleDisplayCard = (direction) => {
        setStartIndex((prevIndex) => {
            if (direction === "next")
                return (prevIndex < item.cardList.length - 1) ? prevIndex + 1 : prevIndex;
            return (prevIndex > 0) ? prevIndex - 1 : prevIndex;
        });
    };

    return (
        <div className={style.listContainer}>
            <div className={style.listHeaderContainer}>
                <div className={style.listHeader}>
                    <img src={item.logo} alt="serviceLogo" className={style.serviceLogo} />
                    <p className={style.listTitle}>{item.name}</p>
                </div>
            </div>
            <div className={style.allListContainer}>
                <div className={style.listBodyContainer}>
                    <div className={style.listBody}>
                        <div className={`${style.blurEffect} ${style.left}`} ></div>
                        {displayedCards && displayedCards.map((cardItem, index) => (
                            <Card key={`card-${index}`} item={cardItem} itemLogo={item.logo} toggleCardActive={toggleCardActive} />
                        ))}
                        <div className={`${style.blurEffect} ${style.right}`} ></div>
                    </div>
                </div>
                <div className={style.locationInCardsContainer}>
                    <IconButton size="small" style={{ backgroundColor: "#252525", color: "#fff", margin: "10px" }} onClick={() => handleDisplayCard("prev")} >
                        <ChevronLeftIcon />
                    </IconButton>
                    {item.cardList.map((cardItem, index) => (
                        <div key={`cardIndex-${index}`} className={ index === startIndex ? style.locationInCardsSelected : style.locationInCards } onClick={() => setStartIndex(index)} />
                    ))}
                    <IconButton size="small" style={{ backgroundColor: "#252525", color: "#fff", margin: "10px", }} onClick={() => handleDisplayCard("next")} >
                        <ChevronRightIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

export default function HorizontalList() {
    const [infos, setInfos] = useState([]);

    const toggleCardActive = (cardId, newActiveState) => {
        let newInfos = [...infos];
        for (let i = 0; i < newInfos.length; ++i) {
            for (let j = 0; j < newInfos[i].cardList.length; ++j) {
                if (newInfos[i].cardList[j].id === cardId) {
                    newInfos[i].cardList[j].isActive = newActiveState;
                    break;
                }
            }
        }
        setInfos(newInfos);
    };

    useEffect(() => {
        fetch(API_URL + "/api/area", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt"),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                let newInfos = [];
                data.data.forEach((item) => {
                    let newInfo = null;
                    let found = false;
                    for (let i = 0; i < newInfos.length; ++i)
                        if (newInfos[i].name === item.action.app) {
                            newInfo = newInfos[i];
                            found = true;
                            break;
                        }
                    if (newInfo === null && !found)
                        newInfo = {
                            logo: IconRouter(item.action.app),
                            name: item.action.app,
                            cardList: [],
                        };
                    let newCard = {
                        id: item.id,
                        when: item.action.displayName,
                        then: [],
                        isActive: item.active,
                    };
                    for (let i = 0; i < item.reactions.length; ++i)
                        newCard.then.push({
                            serviceName: item.reactions[i].app,
                            serviceLogo: IconRouter(item.reactions[i].app),
                            reactionName: item.reactions[i].name,
                        });
                    newInfo.cardList.push(newCard);

                    if (!found)
                        newInfos.push(newInfo);
                });
                setInfos(newInfos);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    return (
        <div className={style.mainContainerList}>
            {infos &&
                infos.map((item, index) => (
                    <ListContainer key={index} item={item} toggleCardActive={toggleCardActive} />
                ))}
        </div>
    );
};
