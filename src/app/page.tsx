import Hero from "@/components/hero";
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="bg-[url('/herobg.png')] bg-center bg-cover">
        
        {/* Section 1 */}
        <section className="flex flex-col md:flex-row items-center justify-around px-8 py-8 text-white space-y-8 md:space-y-0">
          <Image src='/levelUp.png' alt='levelUp' width={300} height={300} className="rounded-lg"/>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Level up your learning</h2>
            <p className="text-lg leading-relaxed">
              Level up your coding skills and rack up XP as you conquer fun, bite-sized lessons in Python, HTML, JavaScript, and more! With every challenge you complete, you'll unlock badges and feel the thrill of progress—just like powering through your favorite adventure game.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-around px-8 py-8 text-white space-y-8 md:space-y-0">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Practice your coding chops</h2>
            <p className="text-lg leading-relaxed">
              Put your skills to the test in Combat Mode — face off against real opponents in intense 1v1 code battles. Win to earn XP and climb the leaderboard, or risk losing it all. Every match is a chance to prove your mastery under pressure!
            </p>
          </div>
          <Image src='/combat.png' alt='combat' width={300} height={300} className="rounded-lg"/>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col md:flex-row items-center justify-around px-8 py-8 text-white space-y-8 md:space-y-0">
          <Image src='/chat.jpeg' alt='chat' width={300} height={300} className="rounded-lg" />
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Make friends along the way</h2>
            <p className="text-lg leading-relaxed">
              Building is so much better together than alone. Join our community forum and Discord to give and receive help, collaborate on projects, and connect over shared passion.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-around px-8 py-8 text-white space-y-8 md:space-y-0">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Master Debugging</h2>
            <p className="text-lg leading-relaxed">
              Sharpen your skills as Combat Mode scrambles your code with sneaky syntax errors and variable name swaps. Can you fix it under pressure and still claim victory?
            </p>
          </div>
          <Image src='/sharpen.png' alt='sharpen' width={300} height={300} className="rounded-lg" />
        </section>

      </div>
    </>
  );
}