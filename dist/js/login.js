import {$,shell} from './shared.js';
import {api,errorMessage,passwordToggle,redirectIfSignedIn} from './auth.js';
shell('login');passwordToggle();redirectIfSignedIn();
$('login-form').onsubmit=async event=>{
 event.preventDefault();$('form-message').textContent='';$('submit').disabled=true;$('login-form').setAttribute('aria-busy','true');
 try{await api('login',{email:$('email').value,password:$('password').value});location.replace('account.html')}
 catch(error){$('form-message').textContent=errorMessage(error);$('password').value=''}
 finally{$('submit').disabled=false;$('login-form').removeAttribute('aria-busy')}
};
