# Linux 折腾笔记

这个主要是记录一下折腾的详细条目，防止以后重装系统后忘掉。。。

## Common(Deprecated)

- `~/.vimrc` 的配置
- `/usr/share/X11/xkb/keycodes` 里修改caps/meta
- `/usr/share/fcitx/data/` 修改字符映射（￥--> $ ）
- `/etc/fstab` 挂载 `/tmp` 到内存
- `~/.local/share/mime/packages/[Any Name].xml` 添加自定义类型
- update-mime-database ~/.local/share/mime 刷新mime数据库

## Arch

### Install

```sh
mkfs.fat -F32 /dev/{esp}
mkfs.ext4 /dev/{root}
timedatectl set-local-rtc 1
timedatectl set-ntp 1
mount /dev/{root} /mnt
mount /dev/{esp} /mnt/boot
vim /etc/pacman.d/mirrorlist
  Server = http://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
  Server = http://mirrors.zju.edu.cn/archlinux/$repo/os/$arch
vim /etc/pacman.conf
  [archlinuxcn]
  Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch

pacstrap /mnt base base-devel linux-zen linux-fireware xorg gvim
genfstab -L /mnt >> /mnt/etc/fstab
```

```sh
arch-chroot /mnt
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc
vim /etc/locale.gen
locale-gen
vim /etc/locale.conf
  LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
vim /etc/hostname
vim /etc/hosts
  127.0.0.1	localhost
  ::1		localhost
  127.0.1.1	myhostname.localdomain	myhostname
passwd
pacman -S intel-ucode refind yay networkmanager plasma nbfc-linux zsh
useradd -m -s /usr/bin/zsh -G wheel bluequantum
passwd bluequantum
yay -S zsh zsh-theme-powerlevel10k zsh-syntax-highlighting zsh-history-substring-search zsh-completions zsh-autosuggestions yakuake konsole libinput-gestures xdotool wmctrl
gpasswd -a bluequantum input
```

### Config

- ```sh
  yay -S kmscon
  sudo systemctl disable getty@tty2.service
  sudo systemctl enable kmsconvt@tty2.service
  ```
- ```
  yay -S seahorse
  yay -S qtkeychain
  /etc/pam.d/sddm << "auth optional pam_gnome_keyring.so" << "session optional pam_gnome_keyring.so auto_start"
  ```
