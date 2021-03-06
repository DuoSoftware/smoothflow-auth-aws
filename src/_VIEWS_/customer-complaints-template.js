import React, { Component } from 'react'

const CustomerComplaints = (props) => {
    return (
        <div style={{width: '100%'}}>
            <table>
                <thead>
                    <tr>
                        <th colSpan="4">Customer Complient - Call Center Ref No : 972400</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="main-aside">Customer Name</td>
                        <td colSpan="3"></td>
                    </tr>
                    <tr>
                        <td className="main-aside">Customer Address</td>
                        <td colSpan="3">
                            <table>
                                <tr className="subhead">
                                    <td colSpan="2">Address</td>
                                    <td>Land Mark</td>
                                </tr>
                                <tr>
                                    <td colSpan="2"></td>
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className="main-aside">Contact Numbers</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="main-aside">NIC number</td>
                        <td colSpan="3"></td>
                    </tr>
                    <tr>
                        <td className="main-aside">Purchase Details</td>
                        <td colSpan="3">
                            <table>
                                <tr className="subhead">
                                    <td>Name of the Shop</td>
                                    <td>Date of Sale</td>
                                    <td>HP AC NO / Order No</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className="main-aside">Product Details</td>
                        <td colSpan="3">
                            <table>
                                <tr className="subhead">
                                    <td>Product</td>
                                    <td>Model</td>
                                    <td>Free Offer</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className="main-aside">Shop Responsible</td>
                        <td colSpan="3"></td>
                    </tr>
                    <tr>
                        <td className="main-aside">Service Centre Responsible</td>
                        <td colSpan="3">
                            <table>
                                <tr className="subhead">
                                    <td colSpan="2">RCS</td>
                                    <td>SFA</td>
                                </tr>
                                <tr>
                                    <td colSpan="2"></td>
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className="main-aside">Description</td>
                        <td colSpan="3">
                            <table>
                                <tr className="subhead">
                                    <td colSpan="3">Customer Perspective</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" style="height: 40px"></td>
                                </tr>
                                <tr className="subhead">
                                    <td colSpan="3">Shop / SFA Perspective</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" style="height: 40px"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className="main-aside">Complaint Handled By</td>
                        <td style="text-align: center;background: #eee">Contact Centre Officer</td>
                        <td colSpan="2"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
};


export default CustomerComplaints;