/** @type {import('next').NextConfig} */
const nextConfig = {
	// Build a standalone output to make Docker images smaller and simpler to run.
	output: 'standalone',
};

export default nextConfig;
