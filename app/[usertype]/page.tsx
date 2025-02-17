"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "antd";

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userType = window.location.pathname.split('/')[1]

        const result = await signIn("credentials", {
            redirect: false,
            username,
            password,
            userType: userType
        });

        if (result?.error) {
            setError("Invalid username or password");
        } else {
            console.log(userType)
            if (userType === 'trustadmin') {
                router.push("/trustadmin/create-admin");
            }
            else if (userType === 'trustsub') {
                router.push("/trustsub/create-admin");
            }
        }
    };

    return (
        <div className="content" style={{ padding: '7rem 0' }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <img src="/logo.png" alt="Image" className="img-fluid" />
                    </div>
                    <div className="col-md-6">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="mb-4">
                                    <h3>Super Admin Sign In</h3>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group first">
                                        <label>Username</label>
                                        <input type="text"
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="form-control" id="username" name="name"
                                        />

                                    </div>
                                    <div className="form-group last mb-4">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-control" id="password" name="pass"
                                        />

                                    </div>

                                    <div className="d-flex mb-5 align-items-center">
                                        <label className="control control--checkbox mb-0"><span className="caption">Remember me</span>
                                            <Checkbox type="checkbox" defaultChecked={true} />
                                            <div className="control__indicator"></div>
                                        </label>

                                    </div>
                                    {error && <p style={{ color: "red" }}>{error}</p>}
                                    <button type="submit">Sign In</button>
                                </form>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignIn;

