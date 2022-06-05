import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot, atom, useRecoilState } from 'recoil';

import { URL_ROOT } from './constant';


const messageState = atom<string>({
  key: 'messageState',
  default: "",
});

const creatSubmitHandler = (inputUserRef, inputPasswordRef, setMessage) => {
  const url = URL_ROOT + "token";
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
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
      if( resBody.status != "ok"){
        setMessage(resBody.status);
      } else {
        setMessage("login ok");
        // protocol の問題? 以下は location.href ではなく、window.location.href でないと、loading がうまくいかない.
        // c.f. https://stackoverflow.com/questions/9903659/difference-between-window-location-and-location-href#:~:text=on%20this%20post.-,window.,href%20is%20shorthand%20for%20window.
        window.location.href = "/"; 
      }
    } catch (e) {
      console.error(e);   
    }
  };
  return submitHandler;
};

export const LoginCore = () => {
  const inputUserRef = React.createRef<HTMLInputElement>();
  const inputPasswordRef = React.createRef<HTMLInputElement>();
  const [message, setMessage] = useRecoilState(messageState);  
  const submitHandler = creatSubmitHandler(inputUserRef, inputPasswordRef, setMessage);
  return (
    <div className="login">
      <h1> {message} </h1>
      {/* <form action="/login" method="post"> */}
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
        <br/><br/>
        <button type="submit" className="btn btn-primary"> login </button>
      </form>
    
    </div>
  );
};

export const Login = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<div> now loading </div>}>
        <LoginCore />
      </Suspense>        
    </RecoilRoot>    
  );
};



function render() {
  ReactDOM.render(
    <Login />,
    document.getElementById('root')
  );
}

render();
