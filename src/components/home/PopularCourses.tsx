import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Users, Award, ArrowRight, Star, IndianRupee } from "lucide-react";

import thumbJava from "@/assets/demo-thumb-java.jpg";
import thumbPython from "@/assets/demo-thumb-python-ai.jpg";
import thumbAI from "@/assets/demo-thumb-data-analytics.jpg";
import thumbCloud from "@/assets/demo-thumb-cloud.jpg";
import thumbCyber from "@/assets/demo-thumb-cybersecurity.jpg";

interface Course {
  title: string;
  duration: string;
  students: string;
  category: string;
  categoryColor: string;
  image: string;
  rating: number;
  reviews: number;
  fee: number;
}

const courses: Course[] = [
  { title: "Java Full Stack", duration: "6 Months", students: "500+", category: "Development", categoryColor: "bg-tech/10 text-tech", image: thumbJava, rating: 4.8, reviews: 1248, fee: 19999 },
  { title: "Python Full Stack", duration: "6 Months", students: "450+", category: "Development", categoryColor: "bg-tech/10 text-tech", image: thumbPython, rating: 4.7, reviews: 1102, fee: 19999 },
  { title: "AI / Machine Learning", duration: "4 Months", students: "300+", category: "AI/ML", categoryColor: "bg-tech/10 text-tech", image: thumbAI, rating: 4.9, reviews: 876, fee: 19999 },
  { title: "Data Analytics", duration: "3 Months", students: "400+", category: "Data", categoryColor: "bg-tech/10 text-tech", image: thumbAI, rating: 4.7, reviews: 945, fee: 19999 },
  { title: "AWS & Cloud Computing", duration: "3 Months", students: "350+", category: "Cloud", categoryColor: "bg-tech/10 text-tech", image: thumbCloud, rating: 4.6, reviews: 712, fee: 19999 },
  { title: "Cyber Security", duration: "4 Months", students: "250+", category: "Security", categoryColor: "bg-tech/10 text-tech", image: thumbCyber, rating: 4.8, reviews: 638, fee: 19999 },
];

const Stars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        );
      })}
    </div>
  );
};

const PopularCourses = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Training</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3">Popular IT Courses</h2>
          </div>
          <Link to="/courses/it">
            <Button variant="outline" className="rounded-full group">
              View All Courses
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.title}
              className="group bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              {/* Image & Category Badge */}
              <div className="relative h-44 overflow-hidden bg-muted">
                <img
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold ${course.categoryColor} backdrop-blur-sm`}>
                  {course.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Rating row */}
                <div className="flex items-center gap-2 mb-3">
                  <Stars rating={course.rating} />
                  <span className="text-xs font-semibold text-foreground">{course.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({course.reviews.toLocaleString("en-IN")})</span>
                </div>

                {/* Course Meta: Duration & Students */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-auto flex items-baseline gap-1 pt-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="text-xl font-bold text-primary">{course.fee.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-muted-foreground">+GST</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-muted/30 border-t flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>Certificate</span>
                </div>
                <Link to="/apply" className="text-sm font-medium text-primary hover:underline">
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;
