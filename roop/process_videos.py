import sys
import subprocess

def process_videos(source_image, input_videos, output_directory, limit):
    """
    Process input videos using run.py from the roop repository.

    Args:
        source_image (str): Path to the source face image.
        input_videos (list): List of input video paths.
        output_directory (str): Directory to save processed videos.
        limit (int): Maximum number of videos to process.
    """
    processed_count = 0

    for input_video in input_videos:
        if processed_count >= limit:
            break  # Stop processing after reaching the limit

        output_video = f"{output_directory}/output_{processed_count + 1}.mp4"

        try:
            # Call the run.py script with the required arguments
            subprocess.run(
                [
                    "python", "run.py",
                    "-s", source_image,
                    "-t", input_video,
                    "-o", output_video,
                    "--execution-provider", "cpu"
                ],
                check=True
            )
            print(f"Processed: {input_video} -> {output_video}")
            processed_count += 1

        except subprocess.CalledProcessError as e:
            print(f"Error processing {input_video}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python process_videos.py <source_image> <output_directory> <limit> <input_video_1> ...")
        sys.exit(1)

    source_image = sys.argv[1]
    output_directory = sys.argv[2]
    limit = int(sys.argv[3])
    input_videos = sys.argv[4:]

    process_videos(source_image, input_videos, output_directory, limit)
