'use client'
import { PlusIcon } from "@heroicons/react/16/solid";
import LongCastExpand from "./LongCastExpand";
import Navbar from "./Navbar";
import StandardCast from "./StandardCast";
import { PrivyProvider } from '@privy-io/react-auth';
import CastModal from "./CastModal";
import { useState } from "react";
import LongcastLink from "./LongcastLink";

interface ContainerProps {
  data: any;
  fetchCasts: Function;
  loading: boolean;
}

export default function Container({ data, fetchCasts, loading }: ContainerProps) {
  const [open, setOpen] = useState(false);
  console.log(data)
  return (
    <PrivyProvider
      appId="clwqrzmdf04wers4y8zmfo0yq"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmYPmzWjxTms9NE2hRYN2gCtS5PKvfHvpaaVN9sRJgvsLT',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <div className="flex min-h-full flex-col">
        <Navbar />

        {/* 3 column wrapper */}
        <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
          {/* Left sidebar & main wrapper */}
          <div className="flex-1 xl:flex">
            <div className="max-h-[50vh] overflow-scroll xl:max-h-screen border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
              <h1 className="text-center mb-8 text-xl">Link to long cast</h1>
              <LongcastLink loading={loading} data={data} />
            </div>

            <div className="max-h-[50vh] overflow-scroll xl:max-h-screen px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              <h1 className="text-center mb-8 text-xl">Native long cast support</h1>
              <LongCastExpand loading={loading} data={data} />
            </div>
          </div>

          <div className="max-h-[50vh] overflow-scroll md:max-h-screen shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
            <h1 className="text-center mb-8 text-xl">Standard cast</h1>
            <StandardCast loading={loading} data={data} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-10 right-10 rounded-full bg-primary p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <CastModal fetchCasts={fetchCasts} open={open} setOpen={setOpen} />
      </div>
    </PrivyProvider>
  )
}
