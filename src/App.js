import React, { Component } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';
import {ModalCard, ModalRoot} from '@vkontakte/vkui';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import './App.css';
import PARTNERS from "./partners";

import Home from './panels/Home';
import Game from './panels/Game';

const PARTNER_FOUND = 'partner_found';
const MODAL_CARD_VICTORY = 'push_to_wall';
const MODAL_CARD_MONEY_SEND = 'money';

class App extends Component {

	constructor(props) {
		super(props)
		this.state = this.getInitState();
	}

	getInitState() {
		return {
			activePanel: 'home',
			fetchedUser: null,
			popout: <ScreenSpinner size='large' />,
			payedAttempts: 0,
			selectedPartner: {
				coords: [55.75, 37.57],
				name: 'Default Location'
			},
			activeModal: null,
			winCoord: {x: Math.floor(Math.random() * 10) + 1, y: Math.floor(Math.random() * 10) + 1}
		};
	}

	findPartner() {
		bridge.sendPromise('VKWebAppGetGeodata', {})
			.then((data) => {
				let partners = PARTNERS;
				let shortestDistance = Math.sqrt(Math.abs((data.lat - partners[0].coords[0])^2 + (data.long - partners[0].coords[1])^2));
				partners.forEach((partner, index) => {
					let currentDistance = Math.sqrt(Math.abs((data.lat - partner.coords[0])^2 + (data.long - partner.coords[1])^2));
					if (currentDistance < shortestDistance) {
						this.setState({
							selectedPartner: partner
						});
					}
				});
				this.setState({
						activeModal: PARTNER_FOUND
					}
				);
			});
	}

	selectPartner(index) {
		this.setState({
			selectedPartner: PARTNERS[index]
		});
		this.setState({
				activeModal: PARTNER_FOUND
			}
		);
	}

	goToPartnersList = () => {
		this.setState({
			activePanel: 'partnersList'
		});
	}

	componentDidMount() {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		this.fetchData();
	};

	fetchData = async function() {
		const user = await bridge.send('VKWebAppGetUserInfo');
		this.setState({
			fetchedUser: user,
			popout: null
		});
	}

	go(e) {
		this.setState({
			activePanel: e.currentTarget.dataset.to
		});
	}

	pushToTheWall() {
		bridge.send("VKWebAppShowWallPostBox", {
			"message": "Я выиграл {{this.selectedPartner.prizeForModal}} в культовой игре Горячо-Холодно, попробуй и ты. https://vk.com/app7341785_799258"
		});
	}

	victoryMessage(prize) {
		this.setState({
			activeModal: MODAL_CARD_VICTORY
		})
	}

	addAttempts() {
		this.setState({
			payedAttempts: this.state.payedAttempts + 3
		});
	}

	showMoney() {
		this.setState({
			activeModal: MODAL_CARD_MONEY_SEND
		});
	}

	render() {

		const modal = (
			<ModalRoot activeModal={this.state.activeModal}>
				<ModalCard
					id={'partner_found'}
					header="Ближайшее предложение"
					caption={this.state.selectedPartner.name}
					actions={[{
						title: 'Выиграть приз',
						mode: 'primary',
						action: () => {
							this.setState({
								activeModal: null,
								activePanel: 'game'
							});
						}
					}]} >
					<h3>Вы можете выиграть: {this.state.selectedPartner.prize}</h3>
					<YMaps>
						<div className='flex-center'>
							<Map defaultState={{ center: [...this.state.selectedPartner.coords], zoom: 9 }} >
								<Placemark geometry={[...this.state.selectedPartner.coords]} />
							</ Map>
						</div>
					</YMaps>
				</ModalCard>
				<ModalCard
					id={MODAL_CARD_VICTORY}
					onClose={() => this.setState({
						activeModal: null
					})}
					header={'Поздравляем. вы выиграли ' + this.selectedPartner.prizeForModal}
					caption={"Для получения приза предъявите на кассе этот код: " + this.selectedPartner.coupon}
					actions={[{
						title: 'Поделиться в ленте',
						mode: 'primary',
						action: () => {
							this.pushToTheWall();
							this.setState({
								activeModal: null,
								activePanel: 'home'
							});
						}
					}]}
				>
				</ModalCard>

				<ModalCard
					id={MODAL_CARD_MONEY_SEND}
					onClose={() => this.setState({
						activeModal: null
					})}
					header="Бесплатные попытки кончились, попробуйте ещё через час или приобретите дополнительные попытки"
					caption="Оплатить 3 попытки за 10 рублей."
					actions={[{
						title: 'Купить',
						mode: 'primary',
						action: () => {
							this.setState({
								activeModal: null
							});
							this.addAttempts();
						}
					}]}
				>

				</ModalCard>
			</ModalRoot>
		)

		return (
			<View activePanel={this.state.activePanel} popout={this.state.popout} modal={modal}>
				<Home
					id='home'
					fetchedUser={this.state.fetchedUser}
					go={this.go}
					findCafe={this.findPartner.bind(this)}
					findPartner={this.findPartner.bind(this)}
					selectPartner={this.selectPartner.bind(this)} />
				<Game
					id='game'
					victoryMessage={this.victoryMessage.bind(this)}
					partner={this.state.selectedPartner}
					winCoord={this.state.winCoord}
					showBuyMoreTaps={this.showMoney.bind(this)}
					payedAttempts={this.state.payedAttempts}
					go={this.go.bind(this)} />
			</View>
		);
	}
}

export default App;

