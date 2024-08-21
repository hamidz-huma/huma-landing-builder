/** @type {import('next').NextConfig} */
const nextConfig = {
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          frameSrc: ["http://localhost:3000","http://localhost"
            ,"https://localhost"
            ],
        },
      }
};

export default nextConfig;
