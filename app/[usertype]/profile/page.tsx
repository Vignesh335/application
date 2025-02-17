"use client"
import { Input, Button, message, Modal, Upload, InputNumber } from 'antd';
import AppLayout from '../../Components/Layout';
import { useState, useEffect } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { useSession } from 'next-auth/react';

export default function SubadminProfile() {
    const [subadmin, setSubadmin] = useState<any>({});
    const [subadminEditData, setSubadminEditData] = useState<any>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const { data: session, update }: any = useSession();

    function getData() {
        fetch(`/api/admins?id=${session.user.id}`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setSubadmin(data[0])
                    setSubadminEditData(data[0])
                }
            })
            .catch((error) => console.error('Error fetching subadmin data:', error));
    }

    useEffect(() => {
        if (session?.user?.id) {
            getData();
        }
    }, [session]);

    const handleChange = (info: any) => {
        console.log(info);
        const file = info.file.originFileObj;
        if (file) {
            getBase64(file).then((url) => {
                setImageUrl(url);
            });
        }
    };

    function getBase64(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
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
            message.error('Image must be smaller than 2MB!');
        }
        console.log(isJpgOrPng && isLt2M);
        return isJpgOrPng && isLt2M;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (subadminEditData) {
            const formData = new FormData();

            formData.append('id', subadminEditData.id.toString());
            formData.append('username', subadminEditData.username);
            formData.append('password', subadminEditData.password);
            formData.append('email', subadminEditData.email);
            formData.append('phone', subadminEditData.phone);
            formData.append('location', subadminEditData.location);
            formData.append('photo', imageUrl);

            try {
                const response = await fetch('/api/admins', {
                    method: 'PUT',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Subadmin updated successfully', result);

                    // Update session with new user data
                    update({
                        ...session,
                        user: {
                            ...session.user,
                            username: subadminEditData.username,
                            email: subadminEditData.email,
                            phone: subadminEditData.phone,
                            location: subadminEditData.location,
                            photo: imageUrl || subadmin.photo, // Handle case if no new image
                        },
                    });

                    setImageUrl('');
                    setIsEditModalOpen(false);
                    setIsUploadModalOpen(false);
                    getData();
                } else {
                    console.error('Error updating subadmin', result.error);
                }
            } catch (error) {
                console.error('Failed to make the PUT request', error);
            }
        }
    };

    return (
        <AppLayout pathIndex={2} defaultpath={'/trustadmin'}>
            <div>
                <h1>Profile</h1>

                {/* Profile Info */}
                <div className="profile-container">
                    <div className="profile-photo">
                        <img
                            src={subadmin.photo}
                            alt="Profile"
                            style={{ borderRadius: '50%', width: '70px', height: '70px' }}
                        />
                        <Button type={'primary'} onClick={() => setIsUploadModalOpen(true)}>
                            Upload Profile
                        </Button>
                    </div>

                    <div className="profile-details">
                        <div>
                            <label>Your Name</label>
                            <p>{subadmin.username}</p>
                        </div>
                        <div>
                            <label>Your Email</label>
                            <p>{subadmin.email}</p>
                        </div>
                        <div>
                            <label>Your Phone</label>
                            <p>{subadmin.phone}</p>
                        </div>
                        <div>
                            <label>Your Location</label>
                            <p>{subadmin.location}</p>
                        </div>
                        <Button
                            type={'primary'}
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Edit Modal */}
                <Modal
                    open={isEditModalOpen}
                    title={'Edit Profile'}
                    onOk={handleSubmit}
                    onCancel={() => {
                        setImageUrl('');
                        setSubadminEditData(subadmin);
                        setIsUploadModalOpen(false);
                    }}
                >
                    <input type="hidden" name="id" value={subadmin.id} />
                    <label>User Name</label>
                    <Input
                        value={subadminEditData.username}
                        onChange={(e) => {
                            setSubadminEditData({
                                ...subadminEditData,
                                'username': e.target.value
                            });
                        }}
                    />
                    <label>Email</label>
                    <Input
                        value={subadminEditData.email}
                        onChange={(e) => {
                            setSubadminEditData({
                                ...subadminEditData,
                                'email': e.target.value
                            });
                        }}
                    />
                    <label>Phone</label>
                    <InputNumber
                        value={subadminEditData.phone}
                        onChange={(value) => {
                            setSubadminEditData({
                                ...subadminEditData,
                                'phone': value
                            });
                        }}
                    />
                    <br />
                    <label>Password</label>
                    <Input.Password
                        value={subadminEditData.password}
                        onChange={(e) => {
                            setSubadminEditData({
                                ...subadminEditData,
                                'password': e.target.value
                            });
                        }}
                    />
                    <label>Address</label>
                    <TextArea
                        value={subadminEditData.location}
                        onChange={(e) => {
                            setSubadminEditData({
                                ...subadminEditData,
                                'location': e.target.value
                            });
                        }}
                    />
                </Modal>

                {/* Upload Modal */}
                <Modal
                    open={isUploadModalOpen}
                    title={'Upload Profile'}
                    onOk={handleSubmit}
                    onCancel={() => {
                        setImageUrl('');
                        setIsUploadModalOpen(false);
                    }}
                >
                    <span className="close" onClick={() => setIsUploadModalOpen(false)}>&times;</span>
                    <h2>Upload Profile</h2>
                    <input type="hidden" name="id" value={subadmin.id} />
                    <label>Upload Profile</label>
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
                </Modal>
            </div>
        </AppLayout>
    );
}
