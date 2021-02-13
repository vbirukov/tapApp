import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, PromoBanner, FixedLayout } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Board from "../components/Board";
import './Game.css';

const BASE_ATTEMPTS = 10;
const TURNS_BETWEEN_ADS = 3;
const osName = platform();

const successSound = new Audio('/audio/click_02.mp3');
const coldSound = new Audio('/audio/colder.mp3');
const winSound = new Audio('/audio/click_01.mp3');

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = this.getInitState();
    }

    getInitState() {
        return {
            board: this.createBoardInfo(10, 20),
            headerCaption: 'Угадай, где чашка кофе',
            isFinished: false,
            clicked: [],
            clickCounter: 0,
            attempsLeft: 10,
            showAd: false,
            prevDistance: undefined
        };
    }

    createBoardInfo(width, height) {
        const boardInfo = [];
        for (let y = 0; y< height; y++) {
            let row = [];
            for (let x = 0; x < width; x++ ) {
                row.push({
                    clicked: false,
                    distance: null,
                    coords: {
                        x,
                        y
                    }
                });
            }
            boardInfo.push(row);
        }
        return boardInfo;
    }

    showAd() {
        this.setState({
            showAd: true
        })
        setTimeout(() => {
            this.setState({
                showAd: false
            })
        }, 3000);
    }

    promoBannerProps = {
        title: 'Заголовок',
        domain: 'vk.com',
        ctaText: 'Перейти',
        advertisingLabel: 'Реклама',
        iconLink: 'https://sun9-7.userapi.com/c846420/v846420985/1526c3/ISX7VF8NjZk.jpg',
        description: 'Описание рекламы',
        ageRestriction: 14
    };

    showBuyMoreTaps() {
        this.props.showBuyMoreTaps();
    }

    timeToShowAd(eachTurns) {
        return ((this.state.clickCounter + 1) % eachTurns) === 0;
    }

    buttonClick(cellModel) {
        if (this.state.isFinished) {
            return;
        }
        if (this.state.attempsLeft < 1) {
            this.showBuyMoreTaps();
            return;
        }
        const x = cellModel.coords.x;
        const y = cellModel.coords.y;
        let result = '';
        this.setState({
            clickCounter: this.state.clickCounter + 1,
            attempsLeft: BASE_ATTEMPTS + this.props.payedAttempts - this.state.clickCounter - 1
        });
        if (this.timeToShowAd(TURNS_BETWEEN_ADS)) {
            this.showAd();
        }
        if ((this.props.winCoord.x === x && this.props.winCoord.y === y)) {
            result = 'success';
            this.setState({
                headerCaption: 'Победа!',
                isFinished: true
            });
            this.props.victoryMessage();
            winSound.play();
            return result
        }
        const distanceToWin = this.getDistance(x, y);
        const newBoard = [...this.state.board];
        if (this.state.prevDistance) {
            if (distanceToWin === 1) {
                result = 'hot';
                this.setState({
                    headerCaption: 'Горячо'
                });
                successSound.play();
            } else if (this.state.prevDistance > distanceToWin) {
                result = 'warm';
                this.setState({
                    headerCaption: 'Теплее'
                });
                successSound.play();
            } else if (this.state.prevDistance < distanceToWin) {
                result = 'cold';
                this.setState({
                    headerCaption: 'Холоднее'
                });
                coldSound.play();
            }
        } else {
            if (distanceToWin === 1) {
                result = 'hot';
                this.setState({
                    board: newBoard,
                    headerCaption: 'Горячо'
                });
                coldSound.play();
            } else if (distanceToWin > 1 && distanceToWin < 4) {
                result = 'warm';
                this.setState({
                    board: newBoard,
                    headerCaption: 'Тепло'
                });
                successSound.play();
            } else {
                result = 'cold';
                this.setState({
                    board: newBoard,
                    headerCaption: 'Холодно'
                });
                coldSound.play();
            }
        }
        this.setState({
            prevDistance: distanceToWin
        });
        return result
    }

    getDistance(x, y) {
        return  Math.abs(x - this.props.winCoord.x) + Math.abs(y - this.props.winCoord.y);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            attempsLeft: 10 + nextProps.payedAttempts - this.state.clickCounter
        })
    }

    render () {

        return (
            <Panel id={this.props.id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={this.props.go} data-to="home">
                        {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                    </PanelHeaderButton>}
                >
                    Попыток:  { this.state.attempsLeft } <span> </span>
                    {this.state.headerCaption}
                </PanelHeader>
                <div style={{height: '100%'}}>
                    {
                        this.state.showAd ?
                            <FixedLayout vertical="bottom">
                                <img
                                    alt={'ads'}
                                    className="imgAd"
                                    src={require('../img/ad.jpg')}/>
                                <PromoBanner isCloseButtonHidden="true" bannerData={this.promoBannerProps}/>
                            </FixedLayout> :
                            <Board
                                boardModel={this.state.board}
                                buttonClickHandler={this.buttonClick.bind(this)}/>
                    }
                </div>

            </Panel>
        )
    }
};

Game.propTypes = {
    winCoord: PropTypes.object.isRequired,
    go: PropTypes.func.isRequired,
    payedAttempts: PropTypes.number
};

export default Game;
