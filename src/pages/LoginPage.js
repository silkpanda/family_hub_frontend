import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const LoginPage = () => {
    const { googleLogin } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <Card className="w-full max-w-sm mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">FamiliFlow</h1>
                <p className="text-gray-500 mb-8">Get your family in sync.</p>
                <Button onClick={googleLogin} className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center">
                    Sign In with Google
                </Button>
            </Card>
        </div>
    );
};

export default LoginPage;
