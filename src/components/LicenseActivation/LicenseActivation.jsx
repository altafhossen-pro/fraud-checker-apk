import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const LicenseActivation = ({ onLogin, error, setError }) => {
    const [licenseKey, setLicenseKey] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform basic validation (you can improve this as needed)
        if (licenseKey && email) {
            // Call the onLogin prop with the entered data
            onLogin(email, licenseKey);
        } else {
            setError('Please fill in both fields');
        }
    };

    return (
        <div className="rounded-md">
            <div>
                <img className='w-44 flex mx-auto my-5' src="/images/logo.png" alt="logo" />
            </div>
            <div className="rounded-lg mt-2 border border-gray-300 dark:border-slate-700">
                <div className="rounded-t-lg">
                    <h2 className="text-center bg-customBlue text-white text-lg font-semibold p-2 rounded-t-lg">
                        Activate Your License
                    </h2>
                    <p className="m-0 p-3 text-sm text-center bg-gray-200 dark:bg-slate-800 dark:border-slate-700 border-b border-gray-300">
                        Please enter your license key to activate the service.
                    </p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-slate-800/30 rounded-b-lg">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            name="license_key"
                            placeholder="Enter Your License Key"
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                        />
                        <input
                            type="email"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            name="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <p lang="bn" className="text-red-600">{error}</p>}
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  bg-customBlue text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                            Activate
                        </button>
                    </form>
                    <p lang="bn" className="mt-4 text-center text-gray-500 dark:text-gray-400">
                        আপনার কি লাইসেন্স Key নেই ? তাহলে{' '}
                        <span
                            onClick={() => window.open('https://percelscore.top', "_system")}
                            className="text-primary underline"
                        >
                            এখানে ক্লিক করুন
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LicenseActivation;
