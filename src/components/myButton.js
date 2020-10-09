import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

const PartnersList = ({ id, go, fetchedUser, findPartner, selectPartner }) => {

    return(
        <Panel id={id}>
            <PanelHeader>Выбор приза</PanelHeader>

            <Group title="Prizes List">
                <Div>
                    <Button size="xl" level="2" onClick={findPartner}>
                        Чашка кофе
                    </Button>
                    <Button size="xl" level="2" onClick={findPartner}>
                        Скидка
                    </Button>
                    <Button size="xl" level="2" onClick={findPartner}>
                        АВТОМОБИЛЬ!!!
                    </Button>
                </Div>
            </Group>

            <Group title="Navigation Example">
                <Div>
                    <Button size="xl" level="2" onClick={findPartner}>
                        Найти ближайший розыгрыш
                    </Button>
                </Div>
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

export default PartnersList;
