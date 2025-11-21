-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin',
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON public.news(published_date DESC);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published news
CREATE POLICY "Allow public read access to published news"
  ON public.news
  FOR SELECT
  USING (published = true);

-- Create policy to allow authenticated users to insert news
CREATE POLICY "Allow authenticated users to insert news"
  ON public.news
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update news
CREATE POLICY "Allow authenticated users to update news"
  ON public.news
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated users to delete news
CREATE POLICY "Allow authenticated users to delete news"
  ON public.news
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.news;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample news data
INSERT INTO public.news (slug, title, excerpt, content, image, category, author, published_date, read_time) VALUES
(
  'top-10-private-jets-farnborough-geneva-2025',
  'Top 10 Private Jets Departing Farnborough (FAB) to Geneva (GVA): 2025',
  'Discover the most popular private jets for the Farnborough to Geneva route in 2025. From light jets to ultra-long-range aircraft, find the perfect option for your journey.',
  '<p>The route between Farnborough Airport (FAB) and Geneva International Airport (GVA) is one of the most popular in European private aviation. In 2025, we''ve seen a significant increase in demand for this route, particularly among business executives and luxury travelers.</p>

<h2>Why Farnborough to Geneva?</h2>
<p>Farnborough Airport, located just 35 miles southwest of Central London, is a dedicated business aviation airport. Geneva, Switzerland''s second-most populous city, is a global financial hub and gateway to the Alps. The combination makes this route incredibly popular for business and leisure travel.</p>

<h2>Top 10 Aircraft for This Route</h2>

<h3>1. Cessna Citation CJ3+</h3>
<p>The CJ3+ is perfect for this short-haul route, offering exceptional efficiency and comfort for up to 9 passengers. Its modern avionics and spacious cabin make it a favorite among business travelers.</p>

<h3>2. Embraer Phenom 300</h3>
<p>Known for its speed and range, the Phenom 300 can complete this journey in just over an hour. The aircraft features a luxurious interior with comfortable seating and state-of-the-art entertainment systems.</p>

<h3>3. Bombardier Learjet 75</h3>
<p>The Learjet 75 combines performance with comfort, featuring a spacious cabin that can accommodate up to 8 passengers. Its high-speed cruise capability makes it ideal for time-sensitive travelers.</p>

<h3>4. Pilatus PC-24</h3>
<p>The PC-24 stands out with its versatility and ability to operate from shorter runways. Its spacious cabin and excellent baggage capacity make it perfect for both business and leisure trips.</p>

<h3>5. Citation Latitude</h3>
<p>Offering one of the widest cabins in its class, the Citation Latitude provides exceptional comfort for up to 9 passengers. Its advanced avionics and low operating costs make it a popular choice.</p>

<h2>Booking Your Flight</h2>
<p>When booking a private jet for this route, consider factors such as passenger count, baggage requirements, and budget. Contact our team for personalized recommendations and competitive quotes.</p>

<h2>Conclusion</h2>
<p>The Farnborough to Geneva route continues to grow in popularity, with a wide range of aircraft options available to suit every need. Whether you''re traveling for business or pleasure, these top 10 jets offer the perfect combination of comfort, efficiency, and luxury.</p>',
  '/news/news-1.jpg',
  'Aircraft',
  'John Smith',
  '2025-01-09',
  '3 min read'
),
(
  'luxury-private-jet-travel-trends-2025',
  'Luxury Private Jet Travel Trends for 2025',
  'Explore the latest trends in private aviation, from sustainable aviation fuel to cutting-edge cabin technologies.',
  '<p>The private aviation industry continues to evolve rapidly, with 2025 bringing exciting new developments in technology, sustainability, and luxury amenities. Let''s explore the key trends shaping the future of private jet travel.</p>

<h2>Sustainable Aviation Fuel (SAF)</h2>
<p>Environmental consciousness has become a priority in private aviation. More operators are offering flights powered by sustainable aviation fuel, which can reduce carbon emissions by up to 80% compared to traditional jet fuel.</p>

<h2>Advanced Cabin Technology</h2>
<p>Modern private jets now feature:</p>
<ul>
<li>High-speed satellite WiFi for seamless connectivity</li>
<li>4K entertainment systems with streaming capabilities</li>
<li>Smart cabin controls via mobile apps</li>
<li>Advanced air purification systems</li>
</ul>

<h2>Wellness-Focused Design</h2>
<p>Private jet interiors are increasingly designed with passenger wellness in mind, featuring circadian lighting systems, premium air quality, and ergonomic seating to reduce jet lag and enhance comfort.</p>

<h2>On-Demand Charter Growth</h2>
<p>The on-demand charter market continues to grow, with more travelers opting for flexible, per-flight options rather than traditional ownership or fractional programs.</p>

<h2>Electric and Hybrid Aircraft</h2>
<p>Several manufacturers are developing electric and hybrid-electric aircraft for short-haul flights, promising quieter, more efficient travel in the near future.</p>',
  '/news/news-2.jpg',
  'Trends',
  'Sarah Johnson',
  '2025-01-08',
  '5 min read'
),
(
  'empty-legs-guide-save-private-jet',
  'Complete Guide to Empty Legs: Save Up to 75% on Private Jet Travel',
  'Learn how to take advantage of empty leg flights and enjoy luxury travel at a fraction of the cost.',
  '<p>Empty leg flights represent one of the best-kept secrets in private aviation, offering significant savings for flexible travelers. This comprehensive guide explains everything you need to know about empty leg flights.</p>

<h2>What Are Empty Legs?</h2>
<p>An empty leg occurs when a private jet needs to fly without passengers to reposition for its next charter or return to its home base. Rather than fly empty, operators offer these flights at substantial discounts.</p>

<h2>How Much Can You Save?</h2>
<p>Empty leg flights typically cost 25-75% less than regular charter prices. A flight that normally costs $20,000 might be available for $5,000-15,000 as an empty leg.</p>

<h2>Finding Empty Leg Flights</h2>
<p>Several strategies can help you find empty leg opportunities:</p>
<ul>
<li>Subscribe to empty leg alert services</li>
<li>Work with a charter broker specializing in empty legs</li>
<li>Check operator websites regularly</li>
<li>Join private aviation membership programs</li>
</ul>

<h2>Considerations and Limitations</h2>
<p>While empty legs offer great value, keep in mind:</p>
<ul>
<li>Routes and dates are fixed and non-negotiable</li>
<li>Flights can be cancelled if a paying client books</li>
<li>Limited flexibility for changes or delays</li>
<li>Best suited for flexible travelers</li>
</ul>

<h2>Tips for Booking</h2>
<p>Maximize your chances of securing a great empty leg deal:</p>
<ul>
<li>Be flexible with your travel dates</li>
<li>Consider nearby airports</li>
<li>Book quickly when you find a good match</li>
<li>Build relationships with charter operators</li>
</ul>',
  '/news/news-3.jpg',
  'Travel Tips',
  'Michael Chen',
  '2025-01-07',
  '4 min read'
),
(
  'most-popular-destinations-2025',
  'Most Popular Private Jet Destinations in 2025',
  'From Monaco to Dubai, discover where high-net-worth individuals are flying this year.',
  '<p>Private jet travel patterns reveal fascinating insights into global luxury travel trends. Here are the most sought-after destinations for private aviation in 2025.</p>

<h2>1. Monaco, France</h2>
<p>The glamorous principality remains a top destination, especially during events like the Monaco Grand Prix and yacht show season.</p>

<h2>2. Dubai, UAE</h2>
<p>Dubai''s world-class infrastructure and luxury offerings continue to attract private aviation traffic, particularly for business and leisure combinations.</p>

<h2>3. Ibiza, Spain</h2>
<p>The Balearic island sees peak private jet traffic during summer months, with travelers seeking its famous beaches and nightlife.</p>

<h2>4. Aspen, USA</h2>
<p>This Colorado ski resort town is a winter favorite among private jet travelers, offering world-class skiing and exclusive amenities.</p>

<h2>5. St. Tropez, France</h2>
<p>The French Riviera destination remains popular with European travelers seeking Mediterranean luxury.</p>',
  '/news/news-1.jpg',
  'Destinations',
  'Emma Williams',
  '2025-01-06',
  '6 min read'
),
(
  'private-aviation-sustainability',
  'The Future of Sustainable Private Aviation',
  'How the private jet industry is embracing sustainability with SAF and electric aircraft.',
  '<p>The private aviation industry is taking significant steps toward sustainability, addressing environmental concerns while maintaining the luxury and convenience that define private jet travel.</p>

<h2>Sustainable Aviation Fuel (SAF)</h2>
<p>SAF is leading the charge in reducing aviation''s carbon footprint. Made from renewable sources like used cooking oil and agricultural waste, SAF can reduce lifecycle carbon emissions by up to 80%.</p>

<h2>Carbon Offset Programs</h2>
<p>Many operators now offer carbon offset programs, allowing passengers to invest in environmental projects that compensate for their flight emissions.</p>

<h2>Electric and Hybrid Aircraft</h2>
<p>Companies like Eviation and Heart Aerospace are developing electric aircraft for regional flights, with commercial operations expected within the next few years.</p>

<h2>Operational Efficiency</h2>
<p>Operators are implementing various efficiency measures:</p>
<ul>
<li>Optimized flight planning to reduce fuel consumption</li>
<li>Weight reduction initiatives</li>
<li>Modern, fuel-efficient aircraft</li>
<li>Single-engine taxi procedures</li>
</ul>

<h2>Industry Commitments</h2>
<p>Major private aviation organizations have committed to achieving net-zero carbon emissions by 2050, with interim targets for 2030.</p>',
  '/news/news-2.jpg',
  'Sustainability',
  'David Martinez',
  '2025-01-05',
  '5 min read'
),
(
  'business-travel-private-jets',
  'Why Business Leaders Choose Private Jets',
  'The advantages of private aviation for corporate executives and entrepreneurs.',
  '<p>For business leaders and corporate executives, time is the most valuable commodity. Private aviation offers unique advantages that go beyond luxury, delivering tangible business benefits.</p>

<h2>Time Efficiency</h2>
<p>Private jets eliminate many time-consuming aspects of commercial travel:</p>
<ul>
<li>No lengthy security lines</li>
<li>Flexible departure times</li>
<li>Access to thousands of airports</li>
<li>Multiple stops in one day</li>
</ul>

<h2>Productivity in Flight</h2>
<p>Private jets offer a confidential, distraction-free environment ideal for:</p>
<ul>
<li>Conducting meetings</li>
<li>Reviewing sensitive documents</li>
<li>Making confidential calls</li>
<li>Preparing presentations</li>
</ul>

<h2>Strategic Advantages</h2>
<p>Business aviation provides strategic benefits:</p>
<ul>
<li>Direct access to remote locations</li>
<li>Ability to visit multiple cities per day</li>
<li>Flexibility to adjust schedules</li>
<li>Team travel capabilities</li>
</ul>

<h2>Cost Considerations</h2>
<p>When factoring in executive time value, team travel costs, and productivity gains, private aviation often proves cost-effective for businesses.</p>

<h2>Popular Business Routes</h2>
<p>Common business aviation routes include:</p>
<ul>
<li>New York to Miami</li>
<li>London to Geneva</li>
<li>Los Angeles to San Francisco</li>
<li>Dubai to Mumbai</li>
</ul>',
  '/news/news-3.jpg',
  'Business',
  'Robert Taylor',
  '2025-01-04',
  '4 min read'
);

-- Create view for published news (optional, for easier querying)
CREATE OR REPLACE VIEW public.published_news AS
SELECT
  id,
  slug,
  title,
  excerpt,
  content,
  image,
  category,
  author,
  published_date,
  read_time,
  created_at,
  updated_at
FROM public.news
WHERE published = true
ORDER BY published_date DESC;

-- Grant permissions
GRANT SELECT ON public.news TO anon;
GRANT SELECT ON public.published_news TO anon;
GRANT ALL ON public.news TO authenticated;
