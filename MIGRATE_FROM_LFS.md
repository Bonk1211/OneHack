# Migrating MP3 Files from Git LFS to Regular Git

Since your MP3 files are below 30MB, you don't need Git LFS. Follow these steps to migrate:

## Steps to Migrate:

1. **Remove files from LFS cache and re-add to Git:**
   ```bash
   git lfs untrack "*.mp3"
   git add .gitattributes
   git rm --cached public/Music/bgm.mp3
   git rm --cached public/audio/kitten-meow.mp3
   git add public/Music/bgm.mp3
   git add public/audio/kitten-meow.mp3
   git commit -m "Migrate MP3 files from LFS to regular Git tracking"
   ```

2. **Push to remote:**
   ```bash
   git push origin main --force
   ```
   ⚠️ **Note**: Use `--force` only if you're sure no one else is working on this branch, or coordinate with your team.

3. **Clean up LFS (optional):**
   ```bash
   git lfs prune
   ```

## Alternative: If migration is complex

If the above doesn't work, you can:
1. Delete the files from the repository
2. Re-add them normally
3. Commit and push

The `.gitattributes` file has already been updated to not use LFS for MP3 files.

