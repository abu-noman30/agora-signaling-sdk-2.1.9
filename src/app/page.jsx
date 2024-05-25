import Link from 'next/link';

export default function Home() {
  return (
    <main className='min-h-screen p-24 flex flex-col items-center justify-center gap-[150px]'>
      <div className=''>
        <h1 className='text-xl font-bold  underline underline-offset-2 mb-10 w-max mx-auto'>Agora-RTM-Sdk (v-2.1.9)</h1>
        <div className='flex items-center justify-center gap-10 w-full'>
          <Link
            href={{
              pathname: '/doctor-portal-sdk',
              query: { uid: 1 }
            }}
          >
            <button className='border-2 border-black rounded-lg p-2 font-bold text-sm'>
              Doctor Portal (1) - Call Patient
            </button>
          </Link>
          <div className='flex flex-col gap-5 border-2 border-gray-200 p-5 rounded-md'>
            <Link
              href={{
                pathname: '/patient-portal-sdk',
                query: { uid: 2 }
              }}
            >
              <button className='border-2 border-black rounded-lg p-2 font-bold text-sm'>
                Patient Portal (2) - Connect Doctor
              </button>
            </Link>
            <Link
              href={{
                pathname: '/patient-portal-sdk',
                query: { uid: 3 }
              }}
            >
              <button className='border-2 border-black rounded-lg p-2 font-bold text-sm'>
                Patient Portal (3) - Connect Doctor
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
