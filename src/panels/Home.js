import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import {Header} from '@vkontakte/vkui';

import './Home.css';

const Home = ({ id, go, fetchedUser, findPartner, selectPartner }) => {

	return(
		<Panel id={id}>
			<PanelHeader>Культовая игра Горячо-Холодно</PanelHeader>
			{fetchedUser &&
			<Group title="User Data Fetched with VK Bridge">
				<Cell
					before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
					description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
				>
					{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
				</Cell>
			</Group>}

			<Group title="Navigation Example">
				<Div>
					<Button size="xl" level="2" onClick={findPartner}>
						Найти ближайшего партнера
					</Button>
				</Div>
			</Group>
			<Group header={<Header mode="secondary">Возможные призы</Header>}>
				<div className={'flexCenter'} >
					<Button
						size="l"
						level="2"
						onClick={selectPartner(0)}>
						Чашка кофе
					</Button>
					<Button
						size="l"
						level="2"
						onClick={selectPartner(1)}>
						Скидка
					</Button>
					<Button
						size="l"
						level="2"
						onClick={selectPartner(2)}>
						АВТОМОБИЛЬ!!!
					</Button>
				</div>
			</Group>
		</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
