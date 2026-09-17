import math

def calculate_stats():
    numbers = [12, 45, 67, 89, 23, 96]
    avg = sum(numbers) / len(numbers)
    return f"Avg: {avg:.2f} | Max: {max(numbers)}"

calculate_stats()
