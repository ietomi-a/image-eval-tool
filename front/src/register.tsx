import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot, atom, useRecoilState} from 'recoil';

import { URL_ROOT } from './constant';
import { LoginLinkHeader } from './header';


const messageState = atom<string>({
  key: 'messageState',
  default: "",
});


const creatSubmitHandler = (inputUserRef, inputPasswordRef, inputRePasswordRef, setMessage) => {
  const url = URL_ROOT + "register";
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      if( inputPasswordRef.current.value != inputRePasswordRef.current.value){
        console.log("password not equal repassword");
        return;
      }
      const bodyInner =
            "username=" + inputUserRef.current.value
            + "&" + "password=" + inputPasswordRef.current.value;
      console.log(bodyInner);
      const data = {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "accept": "application/json"
        },
        body: bodyInner
      };
      const resBody = await fetch(url, data).then( res => res.json() );
      console.log(resBody);
      if( resBody.status == "ng"){
        setMessage("error: user = " + inputUserRef.current.value + " already exists.");
      } else {
        setMessage("success: user = " + inputUserRef.current.value + " activated. go to login page.");
      }
    } catch (e) {
      console.log(e);   
    }
  };
  return submitHandler;
};

export const RegisterCore = () => {
  const inputUserRef = React.createRef<HTMLInputElement>();
  const inputPasswordRef = React.createRef<HTMLInputElement>();
  const inputRePasswordRef = React.createRef<HTMLInputElement>();
  const [message, setMessage] = useRecoilState(messageState);
  const submitHandler = creatSubmitHandler(inputUserRef, inputPasswordRef, inputRePasswordRef, setMessage);

  return (
    <div className="register">
      <LoginLinkHeader />      
      <h1> {message} </h1>
      <form onSubmit={submitHandler}> 
        <br/>
        <p>
          ユーザ名<br/>
          <input ref={inputUserRef} type="text" name="username" placeholder="4文字以上20文字以下の半角英数字" />
        </p>
        <br/>
        <p>
          パスワード<br/>
          <input ref={inputPasswordRef} type="password" name="password" placeholder="6文字以上20文字以下の半角英数字" />
        </p>
        <br/>
        <p>
          パスワード (確認用)<br/>
          <input ref={inputRePasswordRef} type="password" name="password_tmp" placeholder="パスワードと同様" />
        </p>
        <br/><br/>
        <button type="submit" className="btn btn-primary"> register </button>
      </form>
    
    </div>
  );
};

export const Register = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<div> now loading </div>}>
        <RegisterCore />
      </Suspense>        
    </RecoilRoot>    
  );
};



function render() {
  ReactDOM.render(
    <Register />,
    document.getElementById('root')
  );
}

render();
