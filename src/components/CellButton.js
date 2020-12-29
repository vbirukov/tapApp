import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './Button.css'

const CellButton = (props) => {

    const [cellData, setCellData] = useState(props.CellModel);

    const clickHandler = () => {
        const newModel = cellData;
        newModel.distance = props.clickHandler(cellData);
        return newModel;
    };

    return (
        <button
            onClick={() => {setCellData(clickHandler())}}
            className={`GameButton ${cellData.distance}`}/>
    )
}

CellButton.propTypes = {
    CellModel: PropTypes.object.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default CellButton
