/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: '.next',
    webpack: (config: any) => {
        config.module.rules.push({
            test: /\.md$/,
            use: 'raw-loader',
        });
        return config;
    },
    images: {
        unoptimized: true,
        domains: ['github.com', 'raw.githubusercontent.com']
    }
}

export default nextConfig;
