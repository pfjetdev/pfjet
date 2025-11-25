-- Jet Sharing Routes
-- Generated from jet-sharing.md
-- This script populates the jet_sharing_routes table with all routes

-- Clear existing data (optional - comment out if you want to keep existing routes)
-- DELETE FROM jet_sharing_routes;

-- New York → Miami (2h 45m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b7b22e26-45b5-4b02-8b6f-9af2ad7cb29e', '942d7d81-51d2-41e9-aa48-6f27e3af7d46', 'Super Light', 1090, '2h 45m', true)
ON CONFLICT DO NOTHING;

-- Los Angeles → Las Vegas (45m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('51e1139c-b1fa-4b4a-b3b2-e227b76df2a2', '542ddfad-5e4f-4a1d-adb1-7f08fc65b64d', 'Very Light', 236, '45m', true)
ON CONFLICT DO NOTHING;

-- New York → Los Angeles (5h 30m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b7b22e26-45b5-4b02-8b6f-9af2ad7cb29e', '51e1139c-b1fa-4b4a-b3b2-e227b76df2a2', 'Heavy', 2451, '5h 30m', true)
ON CONFLICT DO NOTHING;

-- San Francisco → New York (5h 20m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('59c182ff-5d76-414f-aa40-a36acfef4123', 'b7b22e26-45b5-4b02-8b6f-9af2ad7cb29e', 'Heavy', 2565, '5h 20m', true)
ON CONFLICT DO NOTHING;

-- Chicago → New York (2h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('1819d291-f6fc-4588-aee5-b2563885fe28', 'b7b22e26-45b5-4b02-8b6f-9af2ad7cb29e', 'Midsize', 740, '2h 00m', true)
ON CONFLICT DO NOTHING;

-- Los Angeles → San Francisco (1h 15m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('51e1139c-b1fa-4b4a-b3b2-e227b76df2a2', '59c182ff-5d76-414f-aa40-a36acfef4123', 'Light', 337, '1h 15m', true)
ON CONFLICT DO NOTHING;

-- Dallas → Los Angeles (3h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('6525032b-5d24-4a65-8299-a662935436f5', '51e1139c-b1fa-4b4a-b3b2-e227b76df2a2', 'Super Midsize', 1235, '3h 00m', false)
ON CONFLICT DO NOTHING;

-- Miami → Nassau (50m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('942d7d81-51d2-41e9-aa48-6f27e3af7d46', '8892a1d3-15cb-4918-b8f4-5981bf3aa9f3', 'Very Light', 184, '50m', false)
ON CONFLICT DO NOTHING;

-- New York → Aspen (4h 15m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b7b22e26-45b5-4b02-8b6f-9af2ad7cb29e', '4dc86314-eb79-423e-9944-31bf762ae963', 'Super Midsize', 1726, '4h 15m', false)
ON CONFLICT DO NOTHING;

-- Los Angeles → Aspen (2h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('51e1139c-b1fa-4b4a-b3b2-e227b76df2a2', '4dc86314-eb79-423e-9944-31bf762ae963', 'Midsize', 767, '2h 00m', false)
ON CONFLICT DO NOTHING;

-- London → Paris (1h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('d8847653-f3f9-4146-b892-a10c862c9f12', '8155c34a-7070-413f-b5bf-25af54503750', 'Very Light', 213, '1h 00m', true)
ON CONFLICT DO NOTHING;

-- London → Geneva (1h 40m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('d8847653-f3f9-4146-b892-a10c862c9f12', 'a4ca508f-6968-459f-bfda-1041e178126e', 'Light', 468, '1h 40m', true)
ON CONFLICT DO NOTHING;

-- London → Dubai (6h 45m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('d8847653-f3f9-4146-b892-a10c862c9f12', 'b3ec17ea-9c3e-400c-9072-5641279c78a3', 'Ultra Long Range', 2992, '6h 45m', true)
ON CONFLICT DO NOTHING;

-- Paris → Nice (1h 20m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('8155c34a-7070-413f-b5bf-25af54503750', 'e16b3a5e-2548-4276-a2c6-05aa5b39ee5f', 'Very Light', 359, '1h 20m', true)
ON CONFLICT DO NOTHING;

-- Zurich → London (1h 50m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('9110b982-7e93-4b2b-8a17-ae161c7db9a8', 'd8847653-f3f9-4146-b892-a10c862c9f12', 'Light', 493, '1h 50m', false)
ON CONFLICT DO NOTHING;

-- Milan → Paris (1h 30m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('8c6584a2-bd16-4d29-a116-35aa6c35f636', '8155c34a-7070-413f-b5bf-25af54503750', 'Light', 396, '1h 30m', false)
ON CONFLICT DO NOTHING;

-- Nice → London (2h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('e16b3a5e-2548-4276-a2c6-05aa5b39ee5f', 'd8847653-f3f9-4146-b892-a10c862c9f12', 'Light', 597, '2h 00m', false)
ON CONFLICT DO NOTHING;

-- Geneva → Nice (1h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('a4ca508f-6968-459f-bfda-1041e178126e', 'e16b3a5e-2548-4276-a2c6-05aa5b39ee5f', 'Very Light', 180, '1h 00m', false)
ON CONFLICT DO NOTHING;

-- Monaco → London (2h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('39ea55bd-11cf-4bcb-b79d-b86627349f3d', 'd8847653-f3f9-4146-b892-a10c862c9f12', 'Light', 597, '2h 00m', false)
ON CONFLICT DO NOTHING;

-- Frankfurt → London (1h 40m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('4a1f8623-2c58-46a7-92be-b9e812e5ca04', 'd8847653-f3f9-4146-b892-a10c862c9f12', 'Light', 406, '1h 40m', false)
ON CONFLICT DO NOTHING;

-- Dubai → Maldives (4h 10m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b3ec17ea-9c3e-400c-9072-5641279c78a3', '4c7c3bde-aa18-4b89-b183-4de39a739c6b', 'Super Midsize', 1762, '4h 10m', true)
ON CONFLICT DO NOTHING;

-- Doha → Dubai (1h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('04975369-f2b6-4d4d-aad6-d0e53b881582', 'b3ec17ea-9c3e-400c-9072-5641279c78a3', 'Very Light', 200, '1h 00m', false)
ON CONFLICT DO NOTHING;

-- Dubai → London (6h 45m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b3ec17ea-9c3e-400c-9072-5641279c78a3', 'd8847653-f3f9-4146-b892-a10c862c9f12', 'Ultra Long Range', 2992, '6h 45m', true)
ON CONFLICT DO NOTHING;

-- Dubai → Singapore (7h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b3ec17ea-9c3e-400c-9072-5641279c78a3', '2dbbd344-bfbc-4932-8c90-0e15c0ec370e', 'Ultra Long Range', 2897, '7h 00m', false)
ON CONFLICT DO NOTHING;

-- Hong Kong → Tokyo (4h 30m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('c8bd44a1-eb3b-4f68-9289-b93f0e8e7782', '8aad0a46-7bcc-4205-89e2-205383fd3c0e', 'Heavy', 1823, '4h 30m', true)
ON CONFLICT DO NOTHING;

-- Singapore → Bali (2h 30m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('2dbbd344-bfbc-4932-8c90-0e15c0ec370e', '54faad36-2716-4b2e-8f27-6d44a4e6aa76', 'Midsize', 1018, '2h 30m', false)
ON CONFLICT DO NOTHING;

-- Hong Kong → Shanghai (2h 20m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('c8bd44a1-eb3b-4f68-9289-b93f0e8e7782', '409c0556-7e33-41f5-8989-36cc57db74ff', 'Midsize', 756, '2h 20m', false)
ON CONFLICT DO NOTHING;

-- Tokyo → Seoul (2h 15m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('8aad0a46-7bcc-4205-89e2-205383fd3c0e', '28917d4e-5ce5-4123-8815-cb1c355184a7', 'Midsize', 750, '2h 15m', false)
ON CONFLICT DO NOTHING;

-- Dubai → Riyadh (2h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b3ec17ea-9c3e-400c-9072-5641279c78a3', '73643841-7397-442f-be5d-e2c35dcf22a6', 'Midsize', 527, '2h 00m', false)
ON CONFLICT DO NOTHING;

-- Dubai → Mumbai (3h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b3ec17ea-9c3e-400c-9072-5641279c78a3', 'd2023069-d788-4f56-bca5-b3bbbe2b9a06', 'Super Midsize', 1143, '3h 00m', false)
ON CONFLICT DO NOTHING;

-- ERROR: Missing city for route Miami → Turks and Caicos
-- ERROR: Missing city for route Miami → St. Barts
-- ERROR: Missing city for route St. Maarten → St. Barts
-- São Paulo → Rio de Janeiro (55m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('9a59f38c-dd76-4f9a-9061-af421e5f1f4b', 'd7b4d0dc-fcac-4ceb-9361-3e1e62e944b4', 'Light', 229, '55m', true)
ON CONFLICT DO NOTHING;

-- Mexico City → Los Angeles (3h 30m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('288f3342-4e6e-4a95-9739-2876dce06678', '51e1139c-b1fa-4b4a-b3b2-e227b76df2a2', 'Super Midsize', 1548, '3h 30m', false)
ON CONFLICT DO NOTHING;

-- Sydney → Melbourne (1h 30m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('44d716f7-6aa6-4be8-92bf-8d69643c5d2f', '56cd462a-de55-4251-ae46-d481036f54ff', 'Light', 444, '1h 30m', true)
ON CONFLICT DO NOTHING;

-- Sydney → Auckland (3h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('44d716f7-6aa6-4be8-92bf-8d69643c5d2f', '0461c683-9656-481d-a6d0-c8c18b295b38', 'Super Midsize', 1338, '3h 00m', false)
ON CONFLICT DO NOTHING;

-- Cape Town → Johannesburg (2h 00m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('4e3c8b4e-d822-4a15-bca1-e0c4ad8363ae', '08509e51-1bd8-4e37-be30-4e968126c352', 'Midsize', 769, '2h 00m', false)
ON CONFLICT DO NOTHING;

-- Dubai → Cape Town (9h 30m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('b3ec17ea-9c3e-400c-9072-5641279c78a3', '4e3c8b4e-d822-4a15-bca1-e0c4ad8363ae', 'Ultra Long Range', 4135, '9h 30m', false)
ON CONFLICT DO NOTHING;

-- London → Cape Town (11h 30m)
INSERT INTO jet_sharing_routes (from_city_id, to_city_id, aircraft_category, distance_nm, duration, is_popular)
VALUES ('d8847653-f3f9-4146-b892-a10c862c9f12', '4e3c8b4e-d822-4a15-bca1-e0c4ad8363ae', 'Ultra Long Range', 5951, '11h 30m', false)
ON CONFLICT DO NOTHING;


-- Verify routes were added
SELECT COUNT(*) as total_routes FROM jet_sharing_routes;

-- Show popular routes
SELECT
  c1.name as from_city,
  c2.name as to_city,
  jsr.aircraft_category,
  jsr.duration,
  jsr.distance_nm,
  jsr.is_popular
FROM jet_sharing_routes jsr
JOIN cities c1 ON jsr.from_city_id = c1.id
JOIN cities c2 ON jsr.to_city_id = c2.id
WHERE jsr.is_popular = true
ORDER BY c1.name, c2.name;
