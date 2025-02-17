"use client"
import { Button, Input, message, Modal, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import AppLayout from "../../Components/Layout";

export default function ViewVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState('')

    function getVolunteers() {
        setLoading(true)
        fetch("/api/users")
            .then((response) => response.json())
            .then((data) => {
                setVolunteers(data);
            })
            .catch((error) => {
                console.error("There was an error fetching the subadmin data!", error);
            }).finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getVolunteers();
    }, []);

    const openModal = (id: any) => {
        const volunteer: any = volunteers.find((v: any) => v.id === id);
        setSelectedVolunteer(volunteer);
        setImageUrl(volunteer.photo)
        setModalVisible(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedVolunteer) {
            const formData = new FormData();

            Object.entries(selectedVolunteer).map(([key, value]: any) => {
                if (key !== 'photo') {
                    formData.append(key, value.toString());
                }
            })

            if (imageUrl !== selectedVolunteer.photo) {
                formData.append('photo', imageUrl);
            }

            try {
                const response = await fetch('/api/users', {
                    method: 'PUT',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Subadmin updated successfully', result);
                    setSelectedVolunteer({})
                    setImageUrl('')
                    getVolunteers()
                    setModalVisible(false)
                } else {
                    console.error('Error updating subadmin', result.error);
                }
            } catch (error) {
                console.error('Failed to make the PUT request', error);
            }
        }
    };

    const handleChange = (info: any) => {
        console.log(info)
        const file = info.file.originFileObj
        if (file) {
            getBase64(file).then((url) => {
                setImageUrl(url);
            })
        }
    }

    function getBase64(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(typeof (reader.result) === "string" ? reader.result : "");
            reader.onerror = error => reject(error);
        });
    }

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        console.log(isJpgOrPng && isLt2M)
        return isJpgOrPng && isLt2M;
    };

    return (
        <AppLayout pathIndex={2} defaultpath={'/trustadmin'}>
            <div className="head-title">
                <div className="left">
                    <h1>View Volunteer</h1>
                </div>
            </div>

            <ul className="box-info">
                <li>
                    <i className="bx bx-group"></i>
                    <span className="text">
                        <h3>{volunteers.length}</h3>
                        <p>Total volunteers</p>
                    </span>
                </li>
            </ul>

            <div className="table-data">
                <div className="container">
                    <div className="head">
                        <h3>List</h3>
                        <i className="bx bx-search"></i>
                        <span><input required id="searchInput" type="text" className="form-control" /></span>
                        <i className="bx bx-filter"></i>
                    </div>
                    <Table
                        columns={
                            [
                                {
                                    title: 'User ID',
                                    key: 'id',
                                    dataIndex: 'id'
                                },
                                {
                                    title: 'Username',
                                    key: 'user_id',
                                    dataIndex: 'Name_of_the_User'
                                },
                                {
                                    title: 'Village',
                                    key: 'village',
                                    dataIndex: 'Village'
                                },
                                {
                                    title: 'Mandal',
                                    key: 'Mandal',
                                    dataIndex: 'Mandal'
                                },
                                {
                                    title: 'Phone',
                                    key: 'Phone_Number',
                                    dataIndex: 'Phone_Number'
                                },
                                {
                                    title: 'Actions',
                                    key: 'actions',
                                    render: (_, record: any) => {
                                        return <Button
                                            type="primary"
                                            className="btn btn-warning"
                                            onClick={() => openModal(record.id)}
                                        >
                                            Edit
                                        </Button>
                                    }
                                },
                            ]
                        }
                        dataSource={volunteers}
                        rowKey={"id"}
                    />
                </div>
            </div>

            {modalVisible && selectedVolunteer && (
                <Modal
                    open={modalVisible}
                    onOk={handleSubmit}
                    onCancel={() => {
                        setSelectedVolunteer({})
                        setImageUrl('')
                        setModalVisible(false)
                    }}
                    title={"Edit volunteer"}
                >
                    <div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                User_ID
                            </label>
                            <Input
                                className="form-control"
                                name="User_ID"
                                value={selectedVolunteer.User_ID}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        User_ID: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Name_of_the_User
                            </label>
                            <Input
                                className="form-control"
                                name="Name_of_the_User"
                                value={selectedVolunteer.Name_of_the_User}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Name_of_the_User: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Date_of_Birth
                            </label>
                            <Input
                                className="form-control"
                                name="Date_of_Birth"
                                value={selectedVolunteer.Date_of_Birth}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Date_of_Birth: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Secular_Education
                            </label>
                            <Input
                                className="form-control"
                                name="Secular_Education"
                                value={selectedVolunteer.Secular_Education}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Secular_Education: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Theology_Studies
                            </label>
                            <Input
                                className="form-control"
                                name="Theology_Studies"
                                value={selectedVolunteer.Theology_Studies}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Theology_Studies: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Name_of_the_Wife_or_Husband
                            </label>
                            <Input
                                className="form-control"
                                name="Name_of_the_Wife_or_Husba"
                                value={selectedVolunteer.Name_of_the_Wife_or_Husba}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Name_of_the_Wife_or_Husba: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Number_of_Kids
                            </label>
                            <Input
                                className="form-control"
                                name="Number_of_Kids"
                                value={selectedVolunteer.Number_of_Kids}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Number_of_Kids: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Personal_Testimony
                            </label>
                            <Input
                                className="form-control"
                                name="Personal_Testimony"
                                value={selectedVolunteer.Personal_Testimony}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Personal_Testimony: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Name_of_the_Church
                            </label>
                            <Input
                                className="form-control"
                                name="Name_of_the_Church"
                                value={selectedVolunteer.Name_of_the_Church}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Name_of_the_Church: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Church_Need
                            </label>
                            <Input
                                className="form-control"
                                name="Church_Need"
                                value={selectedVolunteer.Church_Need}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Church_Need: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Evangelism_Need
                            </label>
                            <Input
                                className="form-control"
                                name="Evangelism_Need"
                                value={selectedVolunteer.Evangelism_Need}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Evangelism_Need: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Village_Need
                            </label>
                            <Input
                                className="form-control"
                                name="Village_Need"
                                value={selectedVolunteer.Village_Need}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Village_Need: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Phone_Number
                            </label>
                            <Input
                                className="form-control"
                                name="Phone_Number"
                                value={selectedVolunteer.Phone_Number}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Phone_Number: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Password
                            </label>
                            <Input
                                className="form-control"
                                name="Password"
                                value={selectedVolunteer.Password}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Password: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Door_Number
                            </label>
                            <Input
                                className="form-control"
                                name="Door_Number"
                                value={selectedVolunteer.Door_Number}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Door_Number: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Street
                            </label>
                            <Input
                                className="form-control"
                                name="Street"
                                value={selectedVolunteer.Street}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Street: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Village
                            </label>
                            <Input
                                className="form-control"
                                name="Village"
                                value={selectedVolunteer.Village}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Village: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Mandal
                            </label>
                            <Input
                                className="form-control"
                                name="Mandal"
                                value={selectedVolunteer.Mandal}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Mandal: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                City
                            </label>
                            <Input
                                className="form-control"
                                name="City"
                                value={selectedVolunteer.City}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        City: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Pincode
                            </label>
                            <Input
                                className="form-control"
                                name="Pincode"
                                value={selectedVolunteer.Pincode}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Pincode: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                District
                            </label>
                            <Input
                                className="form-control"
                                name="District"
                                value={selectedVolunteer.District}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        District: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                State
                            </label>
                            <Input
                                className="form-control"
                                name="State"
                                value={selectedVolunteer.State}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        State: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Country
                            </label>
                            <Input
                                className="form-control"
                                name="Country"
                                value={selectedVolunteer.Country}
                                onChange={(e) =>
                                    setSelectedVolunteer((prev: any) => ({
                                        ...prev!,
                                        Country: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                photo
                            </label>
                            <Upload
                                name="avatar"
                                customRequest={() => null}
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                }
                            </Upload>
                        </div>
                    </div>
                </Modal>
            )}
        </AppLayout>
    );
};
