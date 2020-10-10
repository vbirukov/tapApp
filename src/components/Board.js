import React from 'react';
import PropTypes from 'prop-types';
import CellButton from './CellButton';
import './Board.css'

const Board = (props) => {

    return (
        <div className={'Board'}>
            {
                props.boardModel.map((Row, rowIndex) => {
                    return (<div key={rowIndex} className={'Board__row'}>
                        {
                            Row.map((CellModel, index) => {
                            return (<CellButton
                                CellModel={CellModel}
                                key={`${rowIndex}-${index}`}
                                clickHandler={props.buttonClickHandler}/>)
                            })
                        }
                    </div>)
                })
            }
        </div>
    )
}

Board.propTypes = {
    boardModel: PropTypes.array.isRequired,
    buttonClickHandler: PropTypes.func.isRequired,
};

export default Board
