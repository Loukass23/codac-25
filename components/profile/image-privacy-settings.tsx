'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  removeUserImage,
  updateImagePrivacy,
} from '@/actions/user/update-image-privacy';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type ImagePrivacySettingsProps = {
  initialSettings: {
    imagePrivate: boolean;
    photoConsent: boolean;
    hasImage: boolean;
  };
};

export function ImagePrivacySettings({
  initialSettings,
}: ImagePrivacySettingsProps) {
  const [imagePrivate, setImagePrivate] = useState(
    initialSettings.imagePrivate
  );
  const [photoConsent, setPhotoConsent] = useState(
    initialSettings.photoConsent
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleUpdatePrivacy(
    field: 'imagePrivate' | 'photoConsent',
    value: boolean
  ) {
    setIsUpdating(true);

    try {
      const result = await updateImagePrivacy({
        [field]: value,
      });

      if (result.success) {
        if (field === 'imagePrivate') {
          setImagePrivate(value);
        } else {
          setPhotoConsent(value);
        }
        toast.success('Privacy settings updated');
      } else {
        const errorMessage =
          typeof result.error === 'string'
            ? result.error
            : 'Failed to update settings';
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemoveImage() {
    if (
      !confirm(
        'Are you sure you want to remove your profile image? This cannot be undone.'
      )
    ) {
      return;
    }

    setIsRemoving(true);

    try {
      const result = await removeUserImage();

      if (result.success) {
        setImagePrivate(true);
        setPhotoConsent(false);
        toast.success('Image removed successfully');
      } else {
        const errorMessage =
          typeof result.error === 'string'
            ? result.error
            : 'Failed to remove image';
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Privacy</CardTitle>
        <CardDescription>
          Control who can see your profile image
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Photo Consent */}
        <div className='flex items-center justify-between space-x-4'>
          <div className='flex-1 space-y-1'>
            <Label htmlFor='photo-consent'>Photo Consent</Label>
            <p className='text-sm text-muted-foreground'>
              I consent to my photo being used on the platform
            </p>
          </div>
          <Switch
            id='photo-consent'
            checked={photoConsent}
            onCheckedChange={checked =>
              handleUpdatePrivacy('photoConsent', checked)
            }
            disabled={isUpdating}
          />
        </div>

        {/* Make Image Private */}
        <div className='flex items-center justify-between space-x-4'>
          <div className='flex-1 space-y-1'>
            <Label htmlFor='image-private'>Make Image Private</Label>
            <p className='text-sm text-muted-foreground'>
              Only you and administrators can see your profile image
            </p>
          </div>
          <Switch
            id='image-private'
            checked={imagePrivate}
            onCheckedChange={checked =>
              handleUpdatePrivacy('imagePrivate', checked)
            }
            disabled={isUpdating || !photoConsent}
          />
        </div>

        {/* Remove Image */}
        {initialSettings.hasImage && (
          <div className='border-t pt-4'>
            <div className='space-y-2'>
              <Label>Remove Image</Label>
              <p className='text-sm text-muted-foreground'>
                Permanently remove your profile image from the platform
              </p>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleRemoveImage}
                disabled={isRemoving || isUpdating}
              >
                {isRemoving && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Remove Image
              </Button>
            </div>
          </div>
        )}

        {/* Privacy Explanation */}
        <div className='rounded-lg bg-muted p-4 text-sm'>
          <h4 className='font-medium mb-2'>Privacy Levels:</h4>
          <ul className='space-y-1 text-muted-foreground'>
            <li>
              • <strong>Public:</strong> Everyone can see your image
            </li>
            <li>
              • <strong>Private:</strong> Only you and admins can see your image
            </li>
            <li>
              • <strong>No Consent:</strong> Image is not displayed anywhere
            </li>
            <li>
              • <strong>Removed:</strong> Image is permanently deleted
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
