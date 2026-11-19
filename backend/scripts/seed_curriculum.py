
from sqlalchemy import select

from app.db.database import SessionLocal
from app.models import Lesson, LessonSection, WordBank


def make_lesson(day, title, description, goal, explanation, practice, challenge, words, duration=30):
    return {
        "day": day,
        "title": title,
        "description": description,
        "duration": duration,
        "sections": [
            ("learning_goal", "What you will learn", goal),
            ("explanation", "Understand the concept", explanation),
            ("practice", "Guided practice", practice),
            ("assessment", "Your challenge", challenge),
        ],
        "words": words,
    }


CURRICULUM = [
    make_lesson(
        1, "Meet Your Keyboard",
        "Understand your keyboard, typing posture and the foundations of touch typing.",
        "Identify the main keyboard areas, understand touch typing and prepare a comfortable typing position.",
        "A standard QWERTY keyboard contains a letter area, number row, punctuation keys, modifier keys, function keys and navigation keys. Touch typing means typing by feel instead of looking down at every key. Your fingers gradually learn key locations through repetition. The small raised marks on F and J help your index fingers find the home row.",
        "Sit with your back supported, shoulders relaxed and elbows comfortably near your body. Keep wrists neutral rather than bent. Place your left index finger near F and right index finger near J. Explore the letter keys, number row, Enter, Backspace, Shift and Spacebar. Keep your eyes on the screen.",
        "Identify five keyboard keys without rushing. Demonstrate a comfortable posture and locate the F and J bumps by touch.",
        "f j a s d k l ; space enter shift backspace",
    ),
    make_lesson(
        2, "Left Hand Home Row",
        "Learn A, S, D and F and the correct left-hand finger assignments.",
        "Place the left little, ring, middle and index fingers on A, S, D and F.",
        "The home row is the resting position for your fingers. Your left little finger rests on A, ring finger on S, middle finger on D and index finger on F. Keep your fingers curved and relaxed. After reaching another key, return to the home position.",
        "Press A with the little finger, S with the ring finger, D with the middle finger and F with the index finger. Practise one key at a time, then alternate between them. Do not stretch your wrist or lift the whole hand.",
        "Type each home-row key with its assigned finger. Repeat the sequence slowly and return every finger to its starting position.",
        "a s d f as sad dad fad add sass",
    ),
    make_lesson(
        3, "Right Hand Home Row",
        "Learn J, K, L and semicolon using the right hand.",
        "Place the right index, middle, ring and little fingers on J, K, L and semicolon.",
        "The right index finger rests on J, middle finger on K, ring finger on L and little finger on semicolon. The index fingers of both hands rest on F and J, the two keys with raised guide marks. Keep your thumbs relaxed near the spacebar.",
        "Practise J, K, L and semicolon separately. Move only the assigned finger and return it to the home key. Combine right-hand keys with the left-hand home row.",
        "Type the right-hand sequence without looking down. Check that your little finger reaches semicolon without twisting your wrist.",
        "j k l ; jk kl ll all fall ask flask",
    ),
    make_lesson(
        4, "Complete Home Row",
        "Coordinate both hands across all eight home-row keys.",
        "Use all eight home-row keys while keeping each finger assigned to its own area.",
        "The full home row is A S D F G H J K L ;. The left index finger handles F and G. The right index finger handles H and J. The remaining keys belong to their corresponding fingers. The index fingers cover two keys each.",
        "Alternate left and right hands. Practise short combinations, then type words that use only the letters introduced so far. Return fingers to the home row after each reach.",
        "Complete a home-row drill while keeping your hands relaxed and your eyes on the screen.",
        "asdf jkl; fj dk sl all ask dad flask salad",
    ),
    make_lesson(
        5, "Find the F and J Keys by Touch",
        "Use the raised marks on F and J to orient your hands without looking.",
        "Find the home position using touch and rebuild your hand position after movement.",
        "Most standard QWERTY keyboards have small raised marks on F and J. These help you identify where your index fingers belong. Once your index fingers are correctly placed, the other fingers naturally align with the home row.",
        "Look away from the keyboard briefly. Find the raised marks with both index fingers. Place the other fingers on their home keys. Move one finger to a nearby key and return using the guide marks.",
        "Reset your hands on the home row three times without looking down. Stop if you feel strain; accuracy matters more than speed.",
        "ff jj fj jf f j asdf jkl; sad fall flask",
    ),
    make_lesson(
        6, "Home Row Word Practice",
        "Build accuracy and rhythm with words made from home-row letters.",
        "Type familiar home-row combinations with correct finger assignments.",
        "Typing words is different from pressing isolated keys. Your fingers must move smoothly from one key to another. Start slowly and aim for correct letters. Do not sacrifice accuracy to chase speed.",
        "Practise short words first. Notice which fingers move and which remain near their home positions. Pause between words if necessary, and use the spacebar with a thumb.",
        "Type the practice list twice. Compare your accuracy and identify the letters that need more repetition.",
        "sad dad add all fall flask salad ask lad hall dash glass",
    ),
    make_lesson(
        7, "Week 1 Home Row Assessment",
        "Review posture, home-row positions and touch-based hand placement.",
        "Demonstrate correct home-row finger placement and consistent typing.",
        "This assessment reviews the first week's skills. Remember: A S D F belong to the left hand, J K L and semicolon to the right hand. F and J are your tactile guides. A good result means controlled, accurate movement, not maximum speed.",
        "Warm up with individual keys, then practise combinations and short words. Keep your wrists relaxed and your eyes on the screen.",
        "Complete a home-row assessment. Review your incorrect keys and repeat a short drill for the weakest ones. Record your WPM and accuracy as your first baseline.",
        "sad dad all fall ask flask salad lad hall glass",
    ),
    make_lesson(
        8, "Top Row Introduction",
        "Discover the top row and learn how fingers reach upward from home row.",
        "Understand the top-row layout and return each finger to its home position.",
        "The top letter row is Q W E R T Y U I O P. Each finger reaches upward from its home position. The left little finger reaches Q, ring reaches W, middle reaches E and index reaches R and T. The right index reaches Y and U, middle reaches I, ring reaches O and little reaches P.",
        "Start with your fingers on the home row. Reach one key upward using the assigned finger, press it gently and return. Practise each side separately before combining both hands.",
        "Reach and return to all top-row keys without moving your whole hand unnecessarily.",
        "q w e r t y u i o p we were tree write you our",
    ),
    make_lesson(
        9, "Left Hand Top Row",
        "Practise Q, W, E, R and T with the left hand.",
        "Use the left-hand finger assignments for the first five top-row keys.",
        "The left little finger reaches Q, ring finger reaches W, middle finger reaches E, and index finger reaches R and T. R and T are both assigned to the left index finger. Return each finger to A, S, D or F after reaching.",
        "Practise A-Q, S-W, D-E and F-R/F-T movements. Type short combinations and words that use only keys already introduced.",
        "Complete a left-side top-row drill while keeping the other fingers relaxed.",
        "q w e r t we were tree red wet free water",
    ),
    make_lesson(
        10, "Right Hand Top Row",
        "Practise Y, U, I, O and P with the right hand.",
        "Use the correct right-hand finger assignments for the top row.",
        "The right index finger reaches Y and U, middle finger reaches I, ring finger reaches O and little finger reaches P. Return each finger to its home key after reaching upward.",
        "Practise J-Y, J-U, K-I, L-O and semicolon-P movements. Work slowly and avoid stretching the wrist.",
        "Complete the right-side top-row drill and identify which reach feels least comfortable.",
        "y u i o p you our oil pour pilot your",
    ),
    make_lesson(
        11, "Top Row Coordination",
        "Combine both hands while practising top-row and home-row movements.",
        "Move between the two rows smoothly without losing home position.",
        "Your fingers should travel between rows while your hands remain relaxed. Index fingers have a wider reach because they cover two keys in each letter row. Do not slide your entire hand across the keyboard.",
        "Alternate left-side and right-side top-row drills. Mix top-row keys with home-row keys. Return to home position after each reach.",
        "Type mixed-row combinations with controlled rhythm and minimal unnecessary hand movement.",
        "we were tree write quiet quite power tower your water",
    ),
    make_lesson(
        12, "Home and Top Row Words",
        "Build familiarity with common words using the two learned rows.",
        "Type words that combine home-row and top-row letters.",
        "Word practice builds the transitions needed for fluent typing. Focus on the sequence of finger movements rather than memorising the visual shape of a word. Use only the letters covered so far.",
        "Type short words first, then medium-length words. Pause to check difficult transitions. Keep your eyes on the text instead of your fingers.",
        "Complete a mixed-word exercise and review the keys that caused errors.",
        "write quiet power water tree quite your were quite pilot",
    ),
    make_lesson(
        13, "Top Row Accuracy",
        "Improve accuracy while reaching for top-row keys.",
        "Reduce incorrect reaches and return consistently to the home row.",
        "Top-row errors often happen when a finger reaches too far or the hand shifts position. Keep the wrist neutral and move the assigned finger independently. Slow practice helps build a reliable movement pattern.",
        "Repeat difficult pairs such as F-R, F-T, J-Y and J-U. Alternate between a home-row key and its top-row reach. Review mistakes before increasing speed.",
        "Complete an accuracy-focused drill. Aim for controlled, correct movement rather than a speed record.",
        "write quiet quite tree water power were your tower",
    ),
    make_lesson(
        14, "Week 2 Top Row Assessment",
        "Evaluate your control over home and top rows.",
        "Demonstrate accurate typing across the two learned letter rows.",
        "This assessment covers the home row and top row. You should know each finger's assigned keys and be able to return to home position after reaching. Review F and J as your orientation points.",
        "Warm up with home-row combinations, then top-row reaches and mixed words. Practise the keys you find difficult before starting the assessment.",
        "Complete a mixed-row timed assessment. Compare accuracy with Day 7 and note your three weakest keys.",
        "water write quiet power tree your were quite pilot",
    ),
    make_lesson(
    15,
    "Bottom Row Introduction",
    "Discover the bottom row and learn downward finger movements.",
    "Understand the bottom-row layout and how fingers reach downward.",
    (
        "The bottom letter row contains Z, X, C, V, B, N and M. "
        "The left little finger reaches Z, the left ring finger reaches X, "
        "the left middle finger reaches C, and the left index finger reaches V and B. "
        "The right index finger reaches N and M. "
        "After pressing each key, return your finger to its home-row position. "
        "Keep your wrists relaxed and avoid looking at the keyboard."
    ),
    (
        "Start with your fingers on the home row. "
        "Reach downward one key at a time using the assigned finger. "
        "Press the key gently and return to the home row before trying the next key. "
        "Practise with both hands slowly."
    ),
    (
        "Identify the correct finger for each bottom-row key. "
        "Complete a slow reach-and-return drill without looking at the keyboard."
    ),
    "z x c v b n m cab cave face save name man",
),
    make_lesson(
        16, "Left Hand Bottom Row",
        "Practise Z, X, C, V and B with the left hand.",
        "Learn the left-hand bottom-row finger reaches.",
        "The left little finger reaches Z, ring finger X, middle finger C and index finger V and B. The index finger covers both V and B. Keep the other fingers relaxed and return to the home row after each reach.",
        "Practise A-Z, S-X, D-C, F-V and F-B movements. Combine the new keys into short words where possible.",
        "Complete a left-hand bottom-row drill without shifting the whole hand.",
        "z x c v b cab cave cafe face save brave",
    ),
    make_lesson(
        17, "Right Hand Bottom Row",
        "Practise N and M with the right hand and coordinate the bottom row.",
        "Reach N and M using the correct right-hand finger movement.",
        "The right index finger reaches N and M in the standard touch-typing layout. The other right-hand fingers remain assigned to their usual areas. Keep the right wrist relaxed and return to the home row after reaching.",
        "Practise J-N and J-M movements. Alternate between right-hand bottom-row keys and home-row keys. Combine with left-hand bottom-row drills.",
        "Complete a right-hand bottom-row drill and then combine both hands.",
        "n m man name mean moon many minimum number",
    ),
    make_lesson(
        18, "Complete Keyboard Rows",
        "Combine top, home and bottom letter rows.",
        "Use all three letter rows with consistent finger assignments.",
        "You now know the three main letter rows. Your fingers move upward and downward from home position. Use F and J to reset when you lose orientation. Avoid looking down repeatedly.",
        "Practise mixed-row sequences, then type words containing letters from all three rows. Slow down when switching rows and return fingers to home position.",
        "Complete a mixed-row exercise that uses every letter area.",
        "name brave camera cabin number practice keyboard typing improve",
    ),
    make_lesson(
        19, "Common Word Patterns",
        "Practise common letter combinations and frequent English words.",
        "Improve smooth transitions between repeated letter patterns.",
        "Common letter patterns appear frequently in English. Repeated practice helps your fingers anticipate movement, but do not memorise words by sight alone. Type each letter accurately and keep a steady rhythm.",
        "Practise short and medium-length words. Notice repeated combinations such as th, ing, er and ou. Use correct finger assignments for every letter.",
        "Complete a word-pattern drill and review the combinations that slowed you down.",
        "about after because before better people there their through",
    ),
    make_lesson(
        20, "No-Look Typing",
        "Develop confidence typing while keeping your eyes on the screen.",
        "Use tactile orientation and muscle memory instead of watching your hands.",
        "Touch typing depends on consistent finger positions and repeated movement. The F and J bumps help you reset your hands. Looking at the screen helps you notice errors and follow the text.",
        "Place your hands on home row using touch. Type short words while looking at the screen. If you lose position, pause and find F and J again rather than guessing.",
        "Complete a short no-look typing test. Record errors and repeat the weakest key combinations.",
        "keyboard typing practice learning improve focus accuracy confidence",
    ),
    make_lesson(
        21, "Week 3 Three-Row Assessment",
        "Test your ability to use all three letter rows.",
        "Demonstrate control over the complete alphabet and finger assignments.",
        "This assessment reviews top, home and bottom rows. Focus on correct finger assignment, returning to home position and keeping a steady rhythm. Do not rush through unfamiliar combinations.",
        "Warm up with one drill for each row. Then practise mixed words and a short paragraph. Review your weak keys before the assessment.",
        "Complete a mixed-row assessment. Compare your accuracy and WPM with the previous weekly assessments.",
        "practice improve keyboard learning typing accuracy confidence number",
    ),
    make_lesson(
        22, "Sentence Typing",
        "Start typing complete sentences with consistent rhythm and spacing.",
        "Type full sentences accurately and use the spacebar consistently.",
        "A sentence combines words, spaces and punctuation. Use a thumb for the spacebar and avoid inserting multiple spaces between words. Read a few words ahead while keeping your eyes on the screen.",
        "Practise short sentences first. Focus on spaces between words and the final punctuation mark. Keep a natural rhythm instead of stopping after every letter.",
        "Complete a short sentence exercise and review missing spaces or incorrect characters.",
        "the quick brown fox jumps over the lazy dog",
    ),
    make_lesson(
        23, "Capital Letters and Shift",
        "Learn to type capital letters using the Shift key.",
        "Use the opposite hand's Shift key when capitalising a letter.",
        "Hold Shift with one hand and press the letter with the other hand. For example, use right Shift for a capital A and left Shift for a capital L. Release Shift after typing the capital. Caps Lock is useful for longer uppercase sequences, but Shift is usually better for single capitals.",
        "Practise capitalising the first letter of names and sentences. Alternate which Shift key you use when appropriate. Keep the other hand ready for the letter key.",
        "Type names, weekdays and short sentences with correct capitalisation.",
        "Today Monday India Typing Practice Hello World",
    ),
    make_lesson(
        24, "Number Row and Symbols",
        "Learn the number row and the symbols available with Shift.",
        "Locate number keys and practise controlled reaches to the top number row.",
        "The number row sits above the letter rows. On many US-layout keyboards, holding Shift with a number key produces a symbol such as !, @, #, $, %, ^, &, * or parentheses. The exact layout can vary by keyboard region. Use the number-row finger assignments and return to home position after each reach.",
        "Practise number sequences slowly. Then practise common Shift-number combinations using the layout printed on your keyboard. Do not force an unfamiliar symbol layout.",
        "Type a short number sequence and a few symbol combinations accurately.",
        "12345 67890 2026 123 456 789 0 ! @ # $ % & *",
    ),
    make_lesson(
        25, "Punctuation Practice",
        "Learn common punctuation and spacing in real sentences.",
        "Type commas, periods, question marks, apostrophes, quotation marks and colons.",
        "Punctuation makes writing easier to read. A comma usually stays attached to the preceding word, followed by a space. A period ends a sentence. Apostrophes appear in contractions and possessives. Shift may be needed for question marks, quotation marks and other symbols depending on the keyboard layout.",
        "Practise punctuation in short sentences. Avoid adding spaces before commas and periods. Add one space after sentence-ending punctuation before the next sentence.",
        "Type a short paragraph with correct punctuation and spacing.",
        "hello, world. how are you? it's fine! typing is useful; practice matters.",
    ),
    make_lesson(
        26, "Accuracy Training",
        "Focus on reducing mistakes before increasing speed.",
        "Recognise weak keys and use deliberate practice to improve accuracy.",
        "Accuracy means typing the intended characters correctly. Rushing often creates repeated errors. Notice whether mistakes happen on a particular key, row transition, capital letter or punctuation mark. Practise the underlying movement instead of repeating the whole test without reflection.",
        "Review recent mistakes. Create short drills for the weakest keys. Type each sequence slowly, then repeat it at a comfortable pace while maintaining correct finger assignments.",
        "Complete an accuracy-focused test. Record your accuracy and list three keys or combinations to practise again.",
        "accuracy consistency control practice progress careful deliberate improvement",
    ),
    make_lesson(
        27, "Build Typing Speed",
        "Gradually improve typing speed while maintaining accuracy.",
        "Build a consistent rhythm and increase speed without sacrificing control.",
        "Typing speed is often measured in words per minute (WPM). A common calculation uses five characters as one standard word. Speed is useful only when accuracy remains acceptable. Relax your hands, avoid unnecessary pauses and practise at a pace you can control.",
        "Complete short timed exercises. Begin at a comfortable pace, then try a slightly faster attempt. Compare both speed and accuracy rather than focusing on WPM alone.",
        "Complete two timed attempts and compare their WPM and accuracy. Prefer the attempt with the better balance.",
        "speed rhythm focus control improve steady practice",
    ),
    make_lesson(
        28, "Typing Endurance",
        "Build consistency during longer typing sessions.",
        "Maintain comfortable posture, rhythm and accuracy over longer passages.",
        "Longer typing sessions require steady rhythm and comfortable posture. Avoid gripping the keyboard or tensing your shoulders. Take short breaks when needed. A consistent pace is more sustainable than repeated bursts of rushing.",
        "Type a short paragraph, then a longer passage. Keep your wrists neutral and shoulders relaxed. Notice when accuracy begins to fall and pause if you feel discomfort.",
        "Complete a longer paragraph exercise and review whether your accuracy remained consistent.",
        "consistent practice builds confidence and improves typing skills over time",
    ),
    make_lesson(
        29, "Final Mock Assessment",
        "Prepare for graduation with a complete review of the typing curriculum.",
        "Demonstrate control over letters, numbers, punctuation, capitals and sentence structure.",
        "The mock assessment combines the skills from the entire course. Review finger assignments, home-row orientation, number-row reaches, Shift usage and punctuation. Use a steady pace and correct errors thoughtfully.",
        "Warm up with a short letter drill, a number sequence and a punctuation sentence. Then complete a longer mixed-text practice. Review your weakest areas before the final assessment.",
        "Complete a full mock test. Record WPM, accuracy, consistency and weak keys. Choose one area to review before graduation.",
        "typing practice improves accuracy speed confidence and consistency",
    ),
    make_lesson(
        30, "Your Typing Graduation",
        "Complete your final assessment and review your 30-day learning journey.",
        "Demonstrate your touch-typing skills and create a plan for continued improvement.",
        "You have practised keyboard orientation, all letter rows, words, sentences, capitals, numbers, symbols, punctuation, accuracy and speed. Your final result should be compared with your initial baseline. Improvement is personal; there is no single WPM target that suits every beginner.",
        "Warm up comfortably. Complete the final mixed-text assessment without rushing. Review your accuracy, WPM, consistency and weak keys. Compare your result with Day 7 and your later weekly assessments.",
        "Complete your final assessment. Review your progress and choose a realistic practice routine for the next month.",
        "learn practice improve focus accuracy confidence consistency progress",
    ),
]


def seed_curriculum():
    """Create or update all 30 lessons without duplicating related records."""
    db = SessionLocal()

    added_count = 0
    updated_count = 0

    try:
        for item in CURRICULUM:
            lesson = db.scalar(
                select(Lesson).where(
                    Lesson.day_number == item["day"]
                )
            )

            if lesson is None:
                lesson = Lesson(
                    day_number=item["day"],
                    title=item["title"],
                    description=item["description"],
                    duration_minutes=item["duration"],
                )
                db.add(lesson)
                db.flush()
                added_count += 1
            else:
                lesson.title = item["title"]
                lesson.description = item["description"]
                lesson.duration_minutes = item["duration"]
                updated_count += 1

            # Replace only this lesson's sections.
            # Delete-orphan cascade removes old sections on commit.
            lesson.sections.clear()

            for index, (section_type, title, content) in enumerate(
                item["sections"], start=1
            ):
                lesson.sections.append(
                    LessonSection(
                        title=title,
                        section_type=section_type,
                        content=content,
                        order_index=index,
                    )
                )

            # Update an existing word bank instead of adding duplicates.
            if lesson.word_banks:
                word_bank = lesson.word_banks[0]
                word_bank.title = f"Day {item['day']} Practice"
                word_bank.words = item["words"]
                word_bank.difficulty = (
                    "beginner" if item["day"] <= 10
                    else "intermediate" if item["day"] <= 20
                    else "advanced"
                )

                # Remove any extra old banks for this lesson.
                for extra_bank in lesson.word_banks[1:]:
                    db.delete(extra_bank)
            else:
                lesson.word_banks.append(
                    WordBank(
                        title=f"Day {item['day']} Practice",
                        words=item["words"],
                        difficulty=(
                            "beginner" if item["day"] <= 10
                            else "intermediate" if item["day"] <= 20
                            else "advanced"
                        ),
                    )
                )

        db.commit()

        print("\nTYPEUP curriculum synchronization completed.")
        print(f"New lessons added: {added_count}")
        print(f"Existing lessons updated: {updated_count}")
        print(f"Total curriculum lessons processed: {len(CURRICULUM)}")
        print("Each lesson now has 4 sections and a practice word bank.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_curriculum()
