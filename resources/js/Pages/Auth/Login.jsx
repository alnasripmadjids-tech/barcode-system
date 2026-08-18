import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [loginSuccess, setLoginSuccess] = React.useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post('/login', {
            preserveScroll: true,

            onSuccess: () => {
                setLoginSuccess(true);

                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            },
        });
    };
 
return (
    <div
        className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: "url('/images/sct-login-bg.jpg')",
        }}
    >


        <Head title="Log In - SCT" />



            <Head title="Log In - SCT" />

            {/* Main Login Card */}
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">

                <div className="grid md:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div className="flex flex-col items-center justify-center px-8 py-12 text-center text-white md:px-12">

                        {/* SCT Logo */}
                     <div className="mb-6 flex h-36 w-36 items-center justify-center rounded-full border-4 border-yellow-400 bg-white p-4 shadow-xl shadow-yellow-400/30">
                        <img
                           src="/images/sct-logo.png"
                           alt="Sulu College of Technology Logo"
                           className="h-full w-full object-contain"
                                />
                            </div>
                        <h1 className="text-2xl font-extrabold tracking-wide text-yellow-300 md:text-3xl">
                            SULU COLLEGE
                        </h1>

                        <h2 className="text-2xl font-extrabold tracking-wide text-yellow-300 md:text-3xl">
                            OF TECHNOLOGY
                        </h2>

                        <div className="my-5 h-1 w-20 rounded-full bg-white/80"></div>

                        <p className="text-lg font-medium text-blue-50">
                            System Administrator Portal
                        </p>

                        <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
                            Secure access to the Sulu College of Technology
                            administration system.
                        </p>

                    </div>


                    {/* RIGHT SIDE - LOGIN FORM */}       
               <div className="bg-white/80 px-8 py-10 md:px-12 md:py-12 backdrop-blur-md">

                  <div className="mb-8">
             <h2 className="text-2xl font-bold text-blue-900">
                        Welcome Back
           </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sign in to your administrator account
           </p>
             </div>


                        <form onSubmit={submit} className="space-y-5">

                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                />

                                {errors.email && (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>


                            {/* PASSWORD */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />

                                    {/* SHOW / HIDE PASSWORD */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-blue-700 focus:outline-none"
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showPassword ? (
                                            /* Eye Open */
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.8}
                                                stroke="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.964 7.178a1.012 1.012 0 010 .644C20.573 16.49 16.638 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        ) : (
                                            /* Eye Closed */
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.8}
                                                stroke="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.247 0 2.447-.23 3.536-.65"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.066 7.5a10.523 10.523 0 01-3.132 4.39"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65"
                                                />
                                            </svg>
                                        )}
                                    </button>

                                </div>

                                {errors.password && (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>


                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/30 transition duration-200 hover:bg-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Signing in...' : 'ENTER'}
                            </button>

                        </form>

                        <p className="mt-8 text-center text-xs text-slate-400">
                            Sulu College of Technology
                        </p>

                    </div>

                </div>
            </div>


            {/* LOGIN SUCCESSFUL POPUP */}
            {loginSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/60 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">

                        {/* Check Icon */}
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="h-8 w-8 text-blue-700"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-blue-900">
                            Login Successful
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Welcome to the SCT System Administrator Portal.
                        </p>

                        <p className="mt-4 text-xs font-semibold text-blue-600">
                            Redirecting to Dashboard...
                        </p>

                    </div>
                </div>
            )}

        </div>
    );
}

