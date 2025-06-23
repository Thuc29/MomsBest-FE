import { Button } from "react-bootstrap";
import { ImagesSlider } from "../ui/images-slider";
import RotatingText from "../ui/RotatingText";
import StarButton from "../ui/StarButton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  // 8D-style immersive images of mothers and babies
  const images = [
    "https://images.unsplash.com/photo-1571211468362-33f20cb1982f?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561043433-9265f73e685f?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <section className="relative overflow-hidden font-space-grotesk">
      <div className="h-[100vh] mt-0 w-full">
        <div className="relative h-full w-full">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="https://videos.pexels.com/video-files/6849063/6849063-uhd_2560_1440_24fps.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30 z-10" />
          <div className="z-20 relative flex flex-col items-center justify-center h-full w-full px-4 md:px-6">
            <div className="max-w-5xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white mb-6"
              >
                Diễn đàn{" "}
                <span className="inline-block">
                  <RotatingText
                    texts={[
                      "trao đổi",
                      "chia sẻ",
                      "học hỏi",
                      "kết nối",
                      "phát triển",
                    ]}
                    mainClassName="p-1 bg-cyan-200 text-pink-500 overflow-hidden justify-center rounded-lg"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={3500}
                  />
                </span>{" "}
                kinh nghiệm
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8"
              >
                Nơi mọi người cùng nhau chia sẻ kinh nghiệm, thảo luận và học
                hỏi về mọi lĩnh vực trong cuộc sống. Tham gia cộng đồng để kết
                nối và phát triển bản thân mỗi ngày!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <StarButton
                  className="font-space-grotesk rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500 text-white shadow-lg shadow-rose-400/30 transition-all duration-300 hover:opacity-90 active:scale-95 font-bold text-base px-6 py-2"
                  color="cyan"
                  speed="5s"
                >
                  <Link to={"/forum"}>Khám phá diễn đàn</Link>
                </StarButton>

                <Button
                  variant="outline"
                  className="!font-space-grotesk  !rounded-full !border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 active:scale-95 font-bold text-base px-6 py-2"
                  size="default"
                  asChild
                >
                  <Link to="/contact">Tham gia ngay</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
