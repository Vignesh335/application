import React, { useState } from 'react';

const Modal = ({ type, onClose }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div style={{ marginTop: '10%' }} className="modal" id={`${type}Modal`} aria-labelledby="myModalLabel">
      <div style={{ width: '450px' }} className="modal-dialog" role="document">
        <div className="modal-content" style={{ width: '70%' }}>
          <span className="close" style={{ float: 'right', marginRight: '10px', fontSize: '20px', fontWeight: '1000' }} onClick={onClose}>×</span>
          <p></p>
          <div style={{ height: type === 'login' ? '300px' : '350px', width: '100%', padding: '30px' }} className={`${type}form`}>
            <div style={{ alignItems: 'center', justifyContent: 'center', fontWeight: '500', fontSize: '18px', display: 'flex' }}>
              {type === 'login' ? 'Login' : 'Sign up'}
            </div>
            <form style={{ marginTop: '20px', height: type === 'login' ? '70%' : '75%' }} onSubmit={handleSubmit}>
              <input id={`${type}SelectedType`} style={{ display: 'none' }} name="selectedType" />
              <div style={{ fontWeight: '500' }}>Email</div>
              <div>
                <input placeholder="Please enter username" style={{ width: '100%' }} name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {type === 'signup' && (
                <>
                  <div style={{ fontWeight: '500' }}>Mobile Number</div>
                  <div>
                    <input placeholder="Please enter Moblie Number" pattern="[0-9]{10}" style={{ width: '100%' }} name="phone" required />
                  </div>
                </>
              )}
              <div style={{ marginTop: '10px', fontWeight: '500' }}>Password</div>
              <div>
                <input placeholder="Please enter password" style={{ width: '100%' }} type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {type === 'signup' && (
                <>
                  <div style={{ marginTop: '10px', fontWeight: '500' }}>Confirm Password</div>
                  <div>
                    <input placeholder="Please confirm password" style={{ width: '100%' }} type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                </>
              )}
              <br />
              <div style={{ alignItems: 'end', float: 'right', display: 'flex', justifyContent: 'center', height: '25%', width: '100%' }}>
                <button type="submit" className="submitButton" style={{ width: '100%' }}>Submit</button>
              </div>
            </form>
            <div style={{ float: 'right' }}>
              {type === 'login' ? "Don't have an account" : "Already have an account"}
            </div>
            <br />
            <div style={{ float: 'right' }} id={`${type === 'login' ? 'signup' : 'login'}Button`}>
              <a>{type === 'login' ? 'Sign in' : 'Login'}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;