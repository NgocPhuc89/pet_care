/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable no-inner-declarations */
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { changeSearch, fetchAllCustomer, fetchCustomerSearch, fetchDeleteCustomer } from "../../redux/customerSlice";
import { useDispatch, useSelector } from "react-redux";

const ListCustomer = () => {
    const page = useLocation().state?.page;
    const [currentPage, setCurrentPage] = useState(page || 1);
    const [totalPage, setTotalPage] = useState(0);
    const [action, setAction] = useState('next');
    const [background, setBackground] = useState("table-danger");
    const back = useNavigate();
    const dispatch = useDispatch();
    const customerData = useSelector((state) => state.customer.data)
    const loading = useSelector((state) => state.customer.loading)
    const search = useSelector((state) => state.customer.search)
    const id = useSelector((state) => state.customer.customerId)

    useEffect(() => {
        const timeout = setTimeout(() => {
            const action = fetchCustomerSearch(search);
            dispatch(action);
        }, 1000 * 1)
        return () => clearTimeout(timeout);
    }, [search])

    const nextPage = () => {
        currentPage < totalPage ? setCurrentPage(currentPage + 1)(setAction('next')) : ''
    }
    const prevPage = () => {
        currentPage > 1 ? setCurrentPage(currentPage - 1)(setAction('prev')) : ''
    }
    const first = () => {
        setCurrentPage(1);
        setAction('first');
    }
    const last = () => {
        setCurrentPage(totalPage);
        setAction('last')
    }

    const deleteCustomer = async (id, name) => {
        try {
            swal({
                title: "Cảnh Báo!!",
                text: "Bạn Chắc Chắn Muốn Xóa  " + "<" + name + " > " + "  Khỏi Danh Sách",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((del) => {
                    console.log(id);
                    del ? (dispatch(fetchDeleteCustomer(id)),
                        swal("Thông Báo", "Xóa Thành Công" + "<" + name + ">" + " Khỏi Danh Sách", "success"),
                        back("/")) : ''
                })

        } catch (error) {

        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setBackground("white");
        }, 1000 * 3)

        return () => clearTimeout(timer)
    }, [])

    //cuộn xuống theo id 
    function scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
        }
    }
    setTimeout(() => {
        if (id && customerData.length > 0) {
            scrollToElement(id);
        }
    }, 500)

    const handleInput = (e) => {
        const value = e.target.value;
        dispatch(changeSearch(value));
    }

    return (
        loading ? <Spinner /> :
            <div className="container mt-5">
                <h1 className="text-danger text-center mt-4"> Customer List</h1>

                <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-primary mt-5" style={{}}>
                        <NavLink className="nav-link " style={{ color: "white" }} to={'/customer/create'}>
                            <i className="fa fa-plus me-2" />
                            Create
                        </NavLink>
                    </button>
                    <form className="d-flex mt-5" role="search">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={search}
                            onChange={(e) => handleInput(e)}
                        />
                    </form>
                </div>

                <div className="mt-4">
                    <table className="table">
                        <thead>
                            <tr className="table-info">
                                <th>#</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Pet</th>
                                <th>Gender</th>
                                <th>Province</th>
                                <th>District</th>
                                <th>Ward</th>
                                <th>Address</th>
                                <th>Spa</th>
                                <th colSpan={2}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                customerData.length && customerData.map((item, index) => (
                                    <tr key={index} id={item.id}
                                        className={id === item.id ? background : ""}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.pet}</td>
                                        <td>{item.gender}</td>
                                        <td>{item.locationRegion?.province_name}</td>
                                        <td>{item.locationRegion?.district_name}</td>
                                        <td>{item.locationRegion?.ward_name}</td>
                                        <td>{item.address}</td>
                                        <td>{item.spa?.join(" , ")}</td>
                                        <td>
                                            <NavLink to={`/customer/edit/${item.id}`}>
                                                <i role="button" className="fa fa-edit me-3 btn btn-outline-success" />
                                            </NavLink>
                                        </td>
                                        <td>
                                            <i role="button" className="fa fa-trash me-1 btn btn-outline-danger"
                                                onClick={() => deleteCustomer(item.id, item.name)} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                </div>
                <section>
                    <div className="d-flex justify-content-between mb-2">
                        <div>
                            <button type="button" className={`${currentPage == 1 ? 'btn btn-outline-primary me-1' : 'btn btn-outline-primary me-1'}
                             ${action == 'first' ? 'active' : ''}`}
                                onClick={first}>First</button>
                            <button type="button" className={`${currentPage <= 1 ? 'btn btn-outline-primary me-1 disabled ' : 'btn btn-outline-primary me-1'}
                             ${action == 'prev' ? 'active' : ''}`}
                                onClick={prevPage}>Prev</button>
                            <button type="button" className={`${currentPage >= totalPage ? 'btn btn-outline-primary me-1 disabled ' : 'btn btn-outline-primary me-1'}
                             ${action == 'next' ? 'active' : ''}`}
                                onClick={nextPage}>Next</button>
                            <button type="button" className={`${currentPage == totalPage ? 'btn btn-outline-primary' : ' btn btn-outline-primary'}
                             ${action == 'last' ? 'active' : ''} `}
                                onClick={last}>
                                Last</button>
                        </div>
                    </div>
                </section>
            </div >
    )
}

export default ListCustomer;