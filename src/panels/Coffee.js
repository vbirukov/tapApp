import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, PromoBanner, FixedLayout } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import './Coffee.css';
import ad from '../img/ad.jpg';


const osName = platform();

class Coffee extends Component {

    state = {
        headerCaption: 'Угадай, где чашка кофе',
        isFinished: false,
        clicked: [],
        clickCounter: 0,
        attempsLeft: 10,
        showAd: false
    }

    clicked = [];

    prevDistance: undefined;

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

    buttonClick(x, y, index) {
        this.setState({
            clickCounter: this.state.clickCounter + 1,
            attempsLeft: 10 + this.props.payedAttempts - this.state.clickCounter - 1
        });
        if (this.state.clickCounter === 2 || this.state.clickCounter === 5 || this.state.clickCounter === 8) {
            this.showAd();
        } else if (this.state.attempsLeft === 1) {
            this.showBuyMoreTaps();
        }
        if ((this.props.winCoord.x === x && this.props.winCoord.y === y) || this.state.isFinished) {
            this.setState({
                headerCaption: 'Победа!',
                isFinished: true
            });
            if (!this.state.winIndex) {
                this.setState({
                    winIndex: index
                })
            }
            this.props.victoryMessage();
            return
        }
        let tmp = this.state.clicked;
        tmp.push(index);
        this.setState({
            clicked: tmp
        })
        this.state.clicked.includes(index);
        const distanceToWin = this.getDistance(x, y);
        if (this.prevDistance) {
            if (distanceToWin === 1) {
                this.setState({
                    headerCaption: 'Горячо'
                });
            } else if (this.prevDistance > distanceToWin) {
                console.log('Теплее');
                this.setState({
                    headerCaption: 'Теплее'
                });
            } else if (this.prevDistance < distanceToWin) {
                console.log('Холоднее');
                this.setState({
                    headerCaption: 'Холоднее'
                });
            }
        } else {
            if (distanceToWin === 1) {
                this.setState({
                    headerCaption: 'Горячо'
                });
            } else if (distanceToWin > 1 && distanceToWin < 4) {
                this.setState({
                    headerCaption: 'Тепло'
                });
            } else {
                this.setState({
                    headerCaption: 'Холодно'
                });
            }
        }
        this.prevDistance = distanceToWin;
    }

    getDistance(x, y) {
        const rowsDiff = Math.abs(x - this.props.winCoord.x);
        const colsDiff = Math.abs(y - this.props.winCoord.y);
        const distance =  rowsDiff + colsDiff;
        return distance
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            attempsLeft: 10 + nextProps.payedAttempts - this.state.clickCounter
        })
    }

    renderButton(x, y, index) {
        let cls = ['CoffeeButton'];
        cls.push('CoffeeButton-' + platform());
        if(this.state.winIndex === index) {
            cls.push("success")
        } else {
            this.state.clicked.includes(index) ? cls.push("clicked") : cls.push("");
        }
        return (<button
            onClick={() => {this.buttonClick(x, y, index)}}
            className={cls.join(' ')}
            key={index} />)
    }

    render () {

        let board = [];
        let index = 0;
        for (let x = 1; x< 11; x++) {
            let row = [];
            for (let y = 1; y < 11; y++ ) {
                row.push(this.renderButton(x, y, index));
                index++
            }
            board.push(row);
        }


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

                { this.state.showAd ?
                    <FixedLayout vertical="bottom">
                        <img
                            className="imgAd"
                            src={require('../img/ad.jpg')}/>
                        <PromoBanner isCloseButtonHidden="true" bannerData={this.promoBannerProps} />
                    </FixedLayout> :
                    <div className='Coffee'>
                        { board }
                    </div> }

            </Panel>
        )
    }
};

Coffee.propTypes = {
    winCoord: PropTypes.object.isRequired,
    go: PropTypes.func.isRequired,
};

export default Coffee;
