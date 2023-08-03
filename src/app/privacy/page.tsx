/* eslint-disable max-len */
import { Text } from "#/lib/components/atoms/text";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { TbArrowBack } from "react-icons/tb";

const Home = (): ReactElement => {
  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <Image src={"/simplist-privacy.png"} loading="lazy" alt="Simplist logo" quality={5} width={200} height={50} />

      <div className="flex flex-col max-w-2xl w-full mb-40">
        <Link href={"/"} className="text-gray-100 hover:text-gray-300 transition-colors duration-300 ease-in-out flex">
          <TbArrowBack className="text-2xl" />&nbsp;&nbsp;Return to Simplist
        </Link>

        <Text className="text-left text-lg mt-4">
          We, the team at Simplist, are committed to respecting the privacy and security of your personal data when you use our website.
        </Text>
        <Text className="text-left text-lg mt-0.5">
          This privacy policy explains how we collect, use, share, and protect your information.
        </Text>
        <Text className="text-left text-lg mt-4 mt-0.5">
          Please read this policy carefully to understand our practices regarding your personal data.
        </Text>

        <Text className="text-left text-lg mt-4">
          <span className="font-bold">1. Collection of Personal Data</span>
        </Text>

        <Text className="text-left text-lg">
          When you use Simplist, we do not collect any personal data regarding your search activities. <br />
          We do not store search information or user identification data.
        </Text>

        <Text className="text-left text-lg mt-4">
          <span className="font-bold">2. Use of Personal Data</span>
        </Text>

        <Text className="text-left text-lg">
          As mentioned earlier, we do not collect any personal data about you. <br />
          Therefore, we do not use your personal data for any purpose.
        </Text>

        <Text className="text-left text-lg mt-4">
          <span className="font-bold">3. Sharing of Personal Data</span>
        </Text>

        <Text className="text-left text-lg">
          Since we do not collect personal data, we do not share your information with any third parties.
        </Text>

        <Text className="text-left text-lg mt-4">
          <span className="font-bold">4. Protection of Personal Data</span>
        </Text>

        <Text className="text-left text-lg">
          We take appropriate security measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction. <br />
          We use physical and logical security measures to ensure the security of your information.
        </Text>

        <Text className="text-left text-lg mt-4">
          <span className="font-bold">5. Links to Third-Party Websites</span>
        </Text>

        <Text className="text-left text-lg">
          Our site may contain links to third-party websites. <br />
          Please note that we are not responsible for the privacy practices of these sites. <br />
          We encourage you to read the privacy policies of these third-party sites before providing them with your personal information.
        </Text>

        <Text className="text-left text-lg mt-4">
          <span className="font-bold">6. Changes to the Privacy Policy</span>
        </Text>

        <Text className="text-left text-lg">
          We reserve the right to modify this privacy policy at any time. <br />
          Any changes will be posted on this page with an updated date. <br />
          We encourage you to regularly review this privacy policy to stay informed about our privacy practices. <br />
          In the event of any significant changes to this policy, we will also send an automatic email notification to all <strong>registered users</strong> to inform them about the modifications.
        </Text>

        <Text className="text-left text-lg mt-4">
          <span className="font-bold">7. Contact Us</span>
        </Text>

        <Text className="text-left text-lg">
          If you have any questions, concerns, or comments regarding this privacy policy, please contact us at the following email address:&nbsp;
          <Link href="mailto:contact@simplist.page" className={clsx(
            "text-[#fff] hover:text-[#95ccff]",
            "transition duration-300 ease-in-out",
          )}
          >
            contact@simplist.page
          </Link>
        </Text>

        <Text className="text-left text-lg mt-4">
          Thank you for choosing Simplist and trusting us with the protection of your personal data.
        </Text>
      </div>
    </div>
  );
};

export default Home;