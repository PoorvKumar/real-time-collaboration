import React, { useState } from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useAuthenticate } from '../../context/AuthContext';
import { Icons } from '../ui/icons';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const UserAuthForm = () => {

    const { login, loading, googleLogin } = useAuthenticate();

    const navigate=useNavigate();

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const successNotif=()=>
    {
        toast.success("Signin Successful!", {
            position: "top-right",
            theme: "dark"
        });
    };

    const googleLogin2=async (code)=>
    {
        try
        {
            const response=await googleLogin(code);

            if(response)
            {
                successNotif();
                navigate('/');
            }
        }
        catch(error)
        {
            console.log("Error:", error.message);
            toast.error("Unable to signin to Google",{
                position: "top-right",
                theme: "dark"
            });
        }
    }

    const googleLoginFunc=useGoogleLogin({
        onSuccess: googleLogin2,
        onError: ()=> console.log('Google Login Failed'),
        flow: 'auth-code',
      });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!email || !password)
        {
            toast.warn("Missing Information!",{
                position: "top-right",
                theme: "dark"
            });
            return ;
        }

        try
        {
            const result=await login({email,password});

            if(result)
            {
                successNotif();
                navigate('/');
            }
        }
        catch(error)
        {
            console.log("Error:", error.message);
            toast.error("Unable to signin",{
                position: "top-right",
                theme: "dark"
            });
        }
    };

    return (
        <div className='grid gap-3 lg:p-10'>
            <form onSubmit={handleSubmit} className='flex justify-center'>
                <div className='grid gap-2 w-3/4'>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="bruce@wayne.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={loading}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="Password"
                            type="password"
                            disabled={loading}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <Button disabled={loading} type="submit">
                        {loading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Email
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={loading} onClick={()=>googleLoginFunc()} className="mx-16">
                {loading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
            <Button variant="outline" type="button" disabled={loading} className="mx-16">
                {loading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                )}{" "}
                GitHub
            </Button>
        </div>
    )
}

export default UserAuthForm;