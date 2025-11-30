import React, { useState } from 'react';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: (username: string, role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim(), role);
    } else {
        alert(t('login.alert'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream-light p-4">
      <Card className="max-w-md w-full animate-fade-in-up">
        <div className="text-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-green mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v12a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <h1 className="text-3xl font-bold text-brand-green-dark mt-2">{t('login.title')}</h1>
            <p className="text-gray-500">{t('login.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            id="username" 
            label={t('login.usernameLabel')} 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            autoComplete="username"
            aria-label="Username"
          />
          <Input 
            id="password" 
            label={t('login.passwordLabel')} 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
            autoComplete="current-password"
            aria-label="Password"
          />

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">{t('login.roleLegend')}</legend>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="role-farmer"
                  type="radio"
                  name="role"
                  value={UserRole.FARMER}
                  checked={role === UserRole.FARMER}
                  onChange={() => setRole(UserRole.FARMER)}
                  className="h-4 w-4 border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <label htmlFor="role-farmer" className="ml-2 block text-sm text-gray-900">
                  {t('login.roleFarmer')}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role-consumer"
                  type="radio"
                  name="role"
                  value={UserRole.CONSUMER}
                  checked={role === UserRole.CONSUMER}
                  onChange={() => setRole(UserRole.CONSUMER)}
                  className="h-4 w-4 border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <label htmlFor="role-consumer" className="ml-2 block text-sm text-gray-900">
                  {t('login.roleConsumer')}
                </label>
              </div>
            </div>
          </fieldset>

          <p className="text-xs text-center text-gray-400">
            {t('login.demoNote')}
          </p>
          <Button type="submit" className="w-full">
            {t('login.loginButton')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
