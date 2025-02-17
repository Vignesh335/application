"use client"
import React, { useState } from 'react';
import "./charity.css"
import Head from 'next/head';
import Header from '@/app/Components/Header';
import Footer from '@/app/Components/Footer';
import Modal from '@/app/Components/Modal';
import Home from '@/app/Components/Home';

const Charity = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    return (
        <div>
            {/* <Head>
                <title>PRS WORLD</title>
                <link rel="icon" href="/assets/images/logo.png" type="image/png" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
                <link href="/assets/css/bootstrap.css" rel="stylesheet" />
                <link href="/assets/css/bootstrap-theme.min.css" rel="stylesheet" />
                <link href="/assets/css/font-awesome.min.css" rel="stylesheet" />
                <link href="/assets/css/lightbox.css" rel="stylesheet" />
                <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
                <link href="/assets/css/style.css" rel="stylesheet" />
            </Head> */}
            <Header />
            <Home />
            <Footer />
            {showLoginModal && <Modal type="login" onClose={() => setShowLoginModal(false)} />}
            {showSignupModal && <Modal type="signup" onClose={() => setShowSignupModal(false)} />}
        </div>
    );
};

export default Charity;