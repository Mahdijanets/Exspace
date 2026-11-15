import {$,shell} from './shared.js';
import {api,errorMessage,passwordToggle,redirectIfSignedIn} from './auth.js';
shell('register');passwordToggle();redirectIfSignedIn();
$('confirm').oninput=()=>$('confirm').setCustomValidity('');
$('password').oninput=()=>$('confirm').setCustomValidity('');
$('register-form').onsubmit=async event=>{
 event.preventDefault();$('form-message').textContent='';
 if($('password').value!==$('confirm').value){$('confirm').setCustomValidity('Passwords do not match.');$('confirm').reportValidity();return}
 $('submit').disabled=true;$('register-form').setAttribute('aria-busy','true');
 try{await api('register',{name:$('name').value,email:$('email').value,password:$('password').value});location.replace('account.html')}
 catch(error){$('form-message').textContent=errorMessage(error)}
 finally{$('submit').disabled=false;$('register-form').removeAttribute('aria-busy')}
};
