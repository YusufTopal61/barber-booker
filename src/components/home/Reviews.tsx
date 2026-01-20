import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Thomas de Jong",
    rating: 5,
    text: "Beste kapper waar ik ooit geweest ben! Perfecte fade en geweldige sfeer. Kom hier al 2 jaar.",
    date: "2 weken geleden",
  },
  {
    id: 2,
    name: "Mohammed El-Amin",
    rating: 5,
    text: "Top vakmanschap. Ze nemen echt de tijd om te luisteren wat je wilt en leveren altijd een perfect resultaat.",
    date: "1 maand geleden",
  },
  {
    id: 3,
    name: "Jan Bakker",
    rating: 5,
    text: "Eindelijk een barbershop die begrijpt wat een goede baard trim inhoudt. Absolute aanrader!",
    date: "3 weken geleden",
  },
];

const Reviews = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-4 uppercase tracking-wider text-sm">
            Reviews
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Wat Klanten <span className="text-gradient-gold">Zeggen</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ontdek waarom honderden klanten ons vertrouwen voor hun verzorging.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="card-gold p-8 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {review.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-card border border-border rounded-2xl px-8 py-6">
            <div className="text-center pr-8 border-r border-border">
              <p className="text-4xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground">Gemiddelde score</p>
            </div>
            <div className="text-center px-8 border-r border-border">
              <p className="text-4xl font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </div>
            <div className="text-center pl-8">
              <div className="flex gap-1 mb-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Google Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
