import { Request } from 'express';

export function getIpAddress(req: Request): string {
    // Get IP from various headers and fallback options
    const ip = 
        req.headers['x-forwarded-for'] || 
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;

    // Convert to string and handle array case
    const ipString = Array.isArray(ip) ? ip[0] : String(ip);

    // Clean the IP address
    return cleanIpAddress(ipString);
}

function cleanIpAddress(ip: string): string {
    // Remove IPv6 prefix if present
    ip = ip.replace(/^::ffff:/, '');
    
    // Handle localhost
    if (ip === '::1' || ip === 'localhost') {
        return '127.0.0.1';
    }

    // Handle multiple IPs (take first)
    if (ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    return ip;
}

export function isValidIpAddress(ip: string): boolean {
    // IPv4 regex pattern
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    // IPv6 regex pattern
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    if (!ipv4Pattern.test(ip) && !ipv6Pattern.test(ip)) {
        return false;
    }
    
    // Additional validation for IPv4
    if (ipv4Pattern.test(ip)) {
        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    }
    
    return true;
}
