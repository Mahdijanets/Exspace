const errors={
 invalid_email:'Enter a valid email.',
 invalid_name:'Your name must be 2–60 characters.',
 invalid_password:'Use a password of 15–128 characters.',
 invalid_credentials:'Incorrect email or password.',
 email_taken:'This email is already registered. Please sign in.',
 too_many_attempts:'Too many attempts. Try again in 15 minutes.',
 network:'Could not reach the server. Please try again.',
 invalid_origin:'Reload the page and try again.'};
export class ApiError extends Error{constructor(code,status){super(code);this.code=code;this.status=status}}
export const errorMessage=error=>errors[error.code]||errors.network;
export async function api(path,data){
 let response;try{response=await fetch('/api/auth/'+path,{method:data===undefined?'GET':'POST',credentials:'same-origin',headers:data===undefined?{}:{'Content-Type':'application/json','X-Acustik-Request':'1'},body:data===undefined?undefined:JSON.stringify(data)})}catch{throw new ApiError('network',0)}
 let result;try{result=await response.json()}catch{throw new ApiError('network',response.status)}
 if(!response.ok)throw new ApiError(result.error||'unauthorized',response.status);
 return result;
}
export async function currentUser(){try{return (await api('me')).user}catch(error){if(error.status===401)return null;throw error}}
export function passwordToggle(){const button=document.getElementById('toggle-password');const input=document.getElementById('password');const label=()=>{button.textContent=input.type==='password'?'Show':'Hide';button.setAttribute('aria-pressed',String(input.type==='text'))};button.onclick=()=>{input.type=input.type==='password'?'text':'password';label()};label()}
export async function redirectIfSignedIn(){try{if(await currentUser())location.replace('account.html')}catch{}}
