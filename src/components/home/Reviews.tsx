import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Thomas de Jong",
    rating: 5,
    text: "Beste kapper waar ik ooit geweest ben! Perfecte fade en geweldige sfeer.",
    date: "2 weken geleden",
  },
  {
    id: 2,
    name: "Mohammed El-Amin",
    rating: 5,
    text: "Top vakmanschap. Ze nemen echt de tijd om te luisteren wat je wilt.",
    date: "1 maand geleden",
  },
  {
    id: 3,
    name: "Jan Bakker",
    rating: 5,
    text: "Eindelijk een barbershop die begrijpt wat een goede baard trim inhoudt.",
    date: "3 weken geleden",
  },
];

const Reviews = () => {
  return (
    <section className="section border-t border-border">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-number">{"{03}"} — Reviews</span>
          <h2>Wat klanten zeggen</h2>
          <p>
            Ontdek waarom honderden klanten ons vertrouwen voor hun verzorging.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="card-minimal">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-foreground text-foreground"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 border border-border rounded-2xl px-8 py-6">
            <div className="text-center">
              <p className="text-3xl font-semibold">4.9</p>
              <p className="text-xs text-muted-foreground mt-1">Gemiddeld</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-3xl font-semibold">500+</p>
              <p className="text-xs text-muted-foreground mt-1">Reviews</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="flex gap-0.5 mb-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-foreground text-foreground"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Google</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
