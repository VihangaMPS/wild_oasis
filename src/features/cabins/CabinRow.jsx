import styled from 'styled-components';
import {formatCurrency} from "../../utils/helpers.js";
import CreateCabinForm from "./CreateCabinForm.jsx";
import {useDeleteCabin} from "./useDeleteCabin.js";
import {HiPencil, HiTrash} from "react-icons/hi2";
import Modal from "../../ui/Modal.jsx";
import ConfirmDelete from "../../ui/ConfirmDelete.jsx";
import Table from "../../ui/Table.jsx";

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

function CabinRow({cabin}) {
    const {id: cabinId, name, maxCapacity, regularPrice, discount, image} = cabin;
    const {isDeleting, deleteCabin} = useDeleteCabin();

    return (
        <Table.Row>
            <Img src={image}/>
            <Cabin>{name}</Cabin>
            <div>Fits up to {maxCapacity} guests</div>
            <Price>{formatCurrency(regularPrice)}</Price>
            {discount ? <Discount>{formatCurrency(discount)}</Discount> : <span>&mdash;</span>}

            <div>
                <Modal>
                    <Modal.Open opens="edit">
                        <button><HiPencil/></button>
                    </Modal.Open>
                    <Modal.Window name="edit">
                        <CreateCabinForm cabinToEdit={cabin}/>
                    </Modal.Window>

                    <Modal.Open opens="delete">
                        <button><HiTrash/></button>
                    </Modal.Open>
                    <Modal.Window name='delete'>
                        <ConfirmDelete resource="cabins" disabled={isDeleting} onConfirm={() => deleteCabin(cabinId)}/>
                    </Modal.Window>

                </Modal>
            </div>
        </Table.Row>
    );
}

export default CabinRow;
