/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';

const Dashboard = ({ user, email, licenseKey }) => {
    const [inputNumber, setInputNumber] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchData = async () => {
        let phone = inputNumber.trim();
        const phonePattern = /^(?:\+8801|01)\d{9}$/;

        phone = phone.replace(/[-\s]/g, '');

        if (!phone) {
            toast.error('দয়া করে মোবাইল নম্বর লিখুন', {
                style: { fontFamily: "'Hind Siliguri', sans-serif" },
                className: "bangla-text"
            });
            return;
        }

        if (!phonePattern.test(phone)) {
            toast.error('সঠিক মোবাইল নম্বরটি লিখুন');
            return;
        }

        phone = phone.replace(/^(\+88)/, '');

        setLoading(true);
        const url = process.env.NODE_ENV === 'production'
            ? "https://fraud-check-production.up.railway.app/api/v1/data/get-customer-data-extenstion"
            : "http://localhost:8080/api/v1/data/get-customer-data-extenstion";

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, phone, licenseKey }),
                method: "POST"
            });

            if (!response.ok) {
                const apiData = await response.json();
                if (apiData?.message) {
                    setError(apiData?.message);
                    throw new Error(apiData?.message)
                }
            }
            const apiData = await response.json();
            setData(apiData?.data);
        } catch (err) {
            if (err?.message?.includes('Your subscription has expired')) {
                setError(err?.message)
            }
            else {
                setError('Something went wrong. Please try again later or contact with admin.')
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setInputNumber(e.target.value);
    };

    const handleLoadUserData = (event) => {
        event.preventDefault();
        if (inputNumber) {
            fetchData();
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const phone = queryParams.get("phone");

        if (phone) {
            setInputNumber(phone);
        }
    }, []);

    function getRemainingTime(expireDate) {
        const now = new Date();
        const expiration = new Date(expireDate);
        const timeDiff = expiration - now;

        if (timeDiff <= 0) {
            return "Expired";
        }

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days >= 1) {
            return `${days} day${days > 1 ? 's' : ''}`;
        } else if (hours >= 1) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (minutes >= 1) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''}`;
        }
    }
    const handleReset = () => {
        setInputNumber('');
        setData(null);
        setLoading(false);
        setError(null);
    };

    return (
        <div className={`min-h-100 rounded-lg mt-2 border border-gray-300 dark:border-slate-700 px-4 py-4 ${user?.email && 'mb-20'}`}>
            <div className='my-5 flex flex-col justify-center'>
                <div>
                    <img className='w-32 flex mx-auto' src="/images/logo.png" alt="logo" />
                </div>
                <h2 className='text-center text-2xl text-[#0049aa] dark:text-white'>True Fraud Checker</h2>
            </div>
            <div className="rounded-t-lg">
                <h2 className="text-center bg-customBlue text-white text-lg font-semibold p-2 rounded-t-lg">
                    Hello, {user?.fullName}
                </h2>
                {
                    getRemainingTime(user?.expireDate) === "Expired" ? <div>
                        <p className="text-center bg-blue-100 text-red-400 text-sm font-semibold p-2 rounded-t-lg mb-0">
                            Your subscription is Expired. Please upgrade your subscription to continue with us.
                        </p>
                        <div className='flex mx-auto my-3'>
                            <button
                                onClick={() => window.open('https://fraud-checker.netlify.app/#pricing', "_system")}
                                className="py-2 px-8 bg-green-600 text-white rounded hover:bg-grenn-700  mx-auto"
                            >
                                Upgrade Subscription
                            </button>
                        </div>
                    </div> : <p className="text-center bg-blue-100 text-customBlue text-sm font-semibold p-2 rounded-t-lg mb-0">
                        Your subscription is active and will expire in {getRemainingTime(user?.expireDate)}
                    </p>
                }

            </div>

            <form onSubmit={handleLoadUserData}>
                <div className="mt-4 flex gap-2 flex-wrap">
                    <div className='relative w-full'>
                        <input
                            type="text"
                            placeholder="Enter number"
                            value={inputNumber}
                            name="phone"
                            id="phone"
                            onChange={handleInputChange}
                            className="flex-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <svg
                            onClick={handleReset}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#000000"
                            width="1rem"
                            height="1rem"
                            viewBox="0 0 512 512"
                            data-name="Layer 1"
                            id="Layer_1"
                            className='absolute right-4 top-1/2 transform -translate-y-1/2'
                        >
                            <path d="M64,256H34A222,222,0,0,1,430,118.15V85h30V190H355V160h67.27A192.21,192.21,0,0,0,256,64C150.13,64,64,150.13,64,256Zm384,0c0,105.87-86.13,192-192,192A192.21,192.21,0,0,1,89.73,352H157V322H52V427H82V393.85A222,222,0,0,0,478,256Z" />
                        </svg>

                    </div>
                    <button
                        type="submit"
                        className="py-2 px-8 bg-customBlue text-white rounded hover:bg-blue-600 mx-auto w-full"
                    >
                        Search
                    </button>
                </div>
            </form>

            {loading ? (
                <Loader />
            ) : data ? (
                <>
                    <div className="overflow-auto mt-4 ">
                        <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                            <thead>
                                <tr className='dark:border-b'>
                                    <th className="px-4 py-2 text-left bg-gray-200 dark:bg-slate-800 dark:text-slate-200 font-semibold">Courier</th>
                                    <th className="px-4 py-2 text-left bg-gray-200 dark:bg-slate-800 dark:text-slate-200 font-semibold">Total Order</th>
                                    <th className="px-4 py-2 text-left bg-gray-200 dark:bg-slate-800 dark:text-slate-200 font-semibold">Delivered</th>
                                    <th className="px-4 py-2 text-left bg-gray-200 dark:bg-slate-800 dark:text-slate-200 font-semibold">Returned</th>
                                    <th className="px-4 py-2 text-left bg-gray-200 dark:bg-slate-800 dark:text-slate-200 font-semibold">Success Ratio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['steadfast', 'redex', 'pathao', 'paperfly'].map((key, index) => (
                                    <tr key={index} className="border-b border-gray-200 dark:border-slate-600 dark:text-white">
                                        <td className="px-4 py-2">{`${index + 1}. ${key.charAt(0).toUpperCase() + key.slice(1)}`}</td>
                                        <td className="px-4 py-2">{data[key]?.total}</td>
                                        <td className="px-4 py-2">{data[key]?.success}</td>
                                        <td className="px-4 py-2">{data[key]?.cancel}</td>
                                        <td className="px-4 py-2">
                                            {data[key]?.success + data[key]?.cancel > 0
                                                ? ((data[key]?.success / (data[key]?.success + data[key]?.cancel)) * 100).toFixed(2)
                                                : 0}%
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-b border-gray-200 dark:border-slate-600">
                                    <td className="text-primary px-4 py-2">Total</td>
                                    <td className="px-4 py-2 dark:text-white">
                                        {['steadfast', 'redex', 'pathao', 'paperfly'].reduce((sum, key) => sum + (data[key]?.total || 0), 0)}
                                    </td>
                                    <td className="px-4 py-2 dark:text-white">
                                        {['steadfast', 'redex', 'pathao', 'paperfly'].reduce((sum, key) => sum + (data[key]?.success || 0), 0)}
                                    </td>
                                    <td className="px-4 py-2 dark:text-white">
                                        {['steadfast', 'redex', 'pathao', 'paperfly'].reduce((sum, key) => sum + (data[key]?.cancel || 0), 0)}
                                    </td>
                                    <td className="px-4 py-2 dark:text-white">
                                        {(['steadfast', 'redex', 'pathao', 'paperfly'].reduce((sum, key) => sum + (data[key]?.success || 0), 0) +
                                            ['steadfast', 'redex', 'pathao', 'paperfly'].reduce((sum, key) => sum + (data[key]?.cancel || 0), 0)) > 0
                                            ? (
                                                (['steadfast', 'redex', 'pathao', 'paperfly'].reduce((sum, key) => sum + (data[key]?.success || 0), 0) /
                                                    (['steadfast', 'redex', 'pathao', 'paperfly'].reduce((sum, key) => sum + (data[key]?.success || 0), 0) +
                                                        ['steadfast', 'redex', 'pathao', 'paperfly'].reduce((sum, key) => sum + (data[key]?.cancel || 0), 0))) * 100
                                            ).toFixed(2)
                                            : 0}%
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <div className='flex gap-2 my-4 no-print'>
                        <button className='w-full bg-primary text-white px-4 py-3 rounded uppercase'>
                            Download
                        </button>
                        <button onClick={() => {
                            window.print()
                        }} className='w-full bg-customBlue text-white px-4 py-3 rounded uppercase'>
                            Print Result
                        </button>
                    </div>
                </>
            ) : (
                error && <p className="text-red-500">{error}</p>
            )}
        </div>
    );
};

export default Dashboard;
