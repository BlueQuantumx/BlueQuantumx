# Stirling数 学习笔记

*吕欣 at 2016.11.26*

*modified by BlueQuantum at 2020.12.27*

---

### 一些记号

通常幂：$x^0=1$, $x^n=x^{n-1}\cdot x$

下降幂：$x^{n\downarrow}=x\cdot(x-1)\cdot\dots\cdot(x-n+1)$ 

上升幂：$x^{n\uparrow}=x\cdot(x+1)\cdot\dots\cdot(x+n-1)$

组合数：${n\binom n m}=\frac{n!}{m!(n-m)!}=\frac{n^{m\downarrow}}{m!}$

---

## 第一类 Stirling 数

### 定义

$\begin{bmatrix}n\\m\end{bmatrix}$ 表示把 $n$ 个不同的元素分成 $m$ 个圆排列的方案数，分为有符号第一类Stirling数 $s_s(n,m)$ 和无符号第一类Stirling数 $s_u(n,m)$，两者之间的关系为：

$$
s_u(n,m)=(-1)^{n+m}s_s(n,m)
$$

第一类Stirling数和 $n$ 升、降幂函数的关系：

$$
\begin{aligned}
x^{n\uparrow}&=x\cdot(x+1)\cdot\dots\cdot(x+n-1)\\
&=\sum_{k=0}^{n}s_u(n,k)\cdot x^k\\
\end{aligned}
$$

$$
\begin{aligned}
x^{n\downarrow}&=x\cdot(x-1)\cdot\dots\cdot(x-n-1)\\
&=\sum_{k=0}^{n}s_s(n,k)\cdot x^k\\
\end{aligned}
$$

*下文中，如果没有特别声明，我们用 $s(n,m)$ 表示 $s_u(n,m)$。*

### 递推式

用组合方法或研究升、降幂函数的系数可以得到：

$$
s_u(n+1,m)=s_u(n,m-1)+n\cdot s_u(n,m)
$$

$$
s_s(n+1,m)=s_s(n,m-1)-n\cdot s_s(n,m)
$$

### 预处理

由递推式可以 $O(n^2)$ 地打一张表。

对固定 $n$，快速计算 $s(n,*)$ 的问题，可以通过倍增 FFT 展开 $x^{n\uparrow}$ 得到，具体方法如下：

1. 令 $F(x,n)$ 表示 $x^{n\uparrow}$ 的多项式展开，那么 $F(x,2n)=F(x,n)\cdot F(x+n, n)$。
2. $[x^i]F(x+n,n)=\sum_{j=i}^{n}{j\choose i}\cdot [x^j]F(x,n)\cdot n^{j-i}$
3. 上式是一个卷积的形式，可以通过一次 FFT 计算；之后，再计算 $F(x,n)\cdot F(x+n,n)$，即可得到 $F(x,2n)$ 的二项式展开。
4. 由 $F(x,n)$ 得到 $F(x,n+1)$ 的方法比较简单，此处不表。

综上所述，可以通过 $O(\log n)$ 次多项式运算得到 $x^{n\uparrow}$ 的多项式展开，从而求得 $s(n,*)$。

总时间复杂度 $O(n\log n)$。

```cpp
/// @tags: StirlingNumber
#include <algorithm>
#include <cstdio>
#include <iostream>

using namespace std;

namespace BlueQuantum {

typedef long long ll;

int const N = 1 << 19, P = 167772161;

inline ll qpow(ll base, int exp) {
  ll res = 1;
  while (exp) {
    if (exp & 1) res = res * base % P;
    base = base * base % P;
    exp >>= 1;
  }
  return res;
}

int const g = 3, ig = qpow(g, P - 2);

int n;
int cvt[N];
ll inv[N], fac[N];
ll F[N], G[N];

inline void NTT(ll *f, int n, bool typ) {
  for (int i = 1; i < n; ++i)
    if (i < cvt[i]) swap(f[i], f[cvt[i]]);
  for (int i = 2; i <= n; i <<= 1) {
    int mid = (i >> 1), w = qpow(typ ? g : ig, (P - 1) / i);
    for (int j = 0; j < n; j += i) {
      ll wk = 1;
      for (int k = 0; k < mid; ++k, wk = wk * w % P) {
        ll tmp = f[j + k + mid] * wk % P;
        if ((f[j + k + mid] = f[j + k] - tmp) < 0) f[j + k + mid] += P;
        if ((f[j + k] += tmp) >= P) f[j + k] -= P;
      }
    }
  }
  if (!typ) {
    ll inv = qpow(n, P - 2);
    for (int i = 0; i < n; ++i) f[i] = (f[i] * inv) % P;
  }
}

void multiply(ll *f, ll *g, int n, int m) {
  m += n, n = 1;
  while (n < m) n <<= 1;
  for (int i = 0; i < n; ++i) cvt[i] = (cvt[i >> 1] >> 1) | ((i & 1) ? (n >> 1) : 0);
  NTT(f, n, true);
  NTT(g, n, true);
  for (int i = 0; i < n; ++i) f[i] = f[i] * g[i] % P;
  NTT(f, n, false);
}

/// @param n 次数
void solve(ll *f, int n) {
  static ll a[N], b[N];
  if (n == 1) return f[1] = 1, void();
  if (n & 1) {
    solve(f, n - 1);
    for (int i = n; i; --i) f[i] = (f[i - 1] + f[i] * (n - 1) % P) % P;
    /// @note f[0]一直为0
    // f[0] = f[0] * (m - 1) % P;
  } else {
    int mid = n / 2;
    solve(f, mid);
    ll tmp = 1;
    for (int i = 0; i <= mid; ++i)
      a[i] = f[i] * fac[i] % P, b[i] = tmp * inv[i] % P, tmp = tmp * mid % P;
    reverse(a, a + mid + 1);
    multiply(a, b, mid + 1, mid + 1);
    for (int i = 0; i <= mid; ++i) G[i] = inv[i] * a[mid - i] % P;
    multiply(f, G, mid + 1, mid + 1);
    int limit = 1;
    while (limit < (mid + 1) << 1) limit <<= 1;
    for (int i = mid + 1; i < limit; ++i) a[i] = b[i] = G[i] = 0;
    for (int i = n + 1; i < limit; ++i) f[i] = 0;
  }
}

inline void prework(int n) {
  fac[0] = 1;
  for (int i = 1; i <= n; ++i) fac[i] = fac[i - 1] * i % P;
  inv[n] = qpow(fac[n], P - 2);
  for (int i = n - 1; ~i; --i) inv[i] = inv[i + 1] * (i + 1) % P;
}

inline int main() {
  cin >> n;
  prework(n << 1);
  solve(F, n);
  for (int i = 0; i <= n; ++i) cout << F[i] << ' ';
  return 0;
}

}  // namespace BlueQuantum

int main() {
#ifndef ONLINE_JUDGE
#ifdef LOCAL
  freopen("/tmp/CodeTmp/testdata.in", "r", stdin);
  freopen("/tmp/CodeTmp/testdata.out", "w", stdout);
#else
  freopen("StirlingUnsigned.in", "r", stdin);
  freopen("StirlingUnsigned.out", "w", stdout);
#endif
#endif

  ios::sync_with_stdio(false), cin.tie(NULL), cout.tie(NULL);
  return BlueQuantum::main();
}
```

## 第二类Stirling数

### 定义

$\begin{Bmatrix}n\\m\end{Bmatrix}$ 表示把 $n$ 个不同的元素分成 $m$ 个非空集合的方案数，记为 $S(n,m)$。

### 递推式

$$
S(n,m)=S(n-1,m-1)+m\cdot S(n-1,m)
$$

一种组合意义的解释：考虑第 $n$ 个元素被放到之前某个集合或创建一个新集合。

### 与自然数幂的关系

$$
m^n=\sum_{k=0}^{m}m^{k\downarrow}\cdot S(n,k)
$$

理解：考虑 $m^n$ 的一种组合意义：把 $n$ 个相互区分的球放入 $m$ 个盒子的方案数。枚举多少个盒子非空，即可得到上式的结论。

对于固定的 $n$，上式对无穷多个非负整数 $m$ 均成立。因为上式两边实质上是同一个 $n$ 次多项式的两种表示方法，可以得到上式对负的 $m$ 也成立，再结合 $m^{n\downarrow}=(-1)^{n}(-m)^{n\uparrow}$，可以得到一个同样好用的公式：

$$
m^n=\sum_{k=0}^{m}m^{k\uparrow}\cdot S(n,k)\cdot (-1)^{n+k}
$$

### 通项公式

$$
S(n,m)=\frac{1}{m!}\sum_{k=0}^{m}(-1)^k\binom{m}{k}(m-k)^n
$$

**这里介绍三种推导方法：**

#### 容斥原理

思路：先使集合互不相同，考虑总的方案数减去一定有集合为空的方案数，即可得到上式。

#### 生成函数

考虑固定 $m$，并区分集合，考虑 $S(n,m)$ 关于 $n$ 的生成函数：

$$
a_n=S(n,m)\cdot m!
$$

因每个集合元素互相区分，且不能为空，可以得到每个集合对应的指数生成函数为 $e^x-1$，所以有：

$$
\sum_{k=0}^{\infty}\frac{a_k}{k!}\cdot x^k=(e^x-1)^m
$$

二项式展开，可以得到：

$$
\begin{aligned}
G(x)&=(e^x-1)^m\\
&=\sum_{i=0}^{m}(-1)^{m-i}\binom{m}{i}e^{ix}
\end{aligned}
$$

考虑 $e^{ix}$ 的麦克劳林级数：

$$
e^{ix}=\sum_{k=0}^{\infty}\frac{i^k}{k!}x^k
$$

对比生成函数两边的系数，有：

$$
a_n=\sum_{k=0}^{m}(-1)^{m-k}\binom{m}{k}k^n
$$

两边乘上 $\frac{1}{m!}$，得证。

#### 反演（等式变换）

考虑通过式子 $m^n=\sum_{k=0}^{m}m^{k\downarrow}\cdot S(n,k)$ 反演求得关于 $S(n,m)$ 的通项。

要消除系数，尝试不同的 $m$：

$$
(m-h)^n=\sum_{k=0}^{m}(m-h)^{k\downarrow}\cdot S(n,k)
$$

两边配上组合数：

$$
\begin{aligned}
\binom{m}{h}(m-h)^n&=\sum_{k=0}^{m}\binom{m}{h}(m-h)^{k\downarrow}\cdot S(n,k)\\
&=\sum_{k=0}^{m}\binom{m-k}{h}m^{k\downarrow}\cdot S(n,k)
\end{aligned}
$$

考虑消组合数，用不同的 $h$ 交替求和：

$$
\begin{aligned}
\sum_{h=0}^{m}(-1)^{h}\binom{m}{h}(m-h)^n
&=\sum_{k=0}^{m}m^{k\downarrow}\cdot S(n,k)\cdot\sum_{h=0}^{m-k}(-1)^{h}\binom{m-k}{h}\\
&=m!\cdot S(n,m)
\end{aligned}
$$

把 $m!$ 移至左边，得证。

### 一种反演公式

$$
\sum_{i=1}^{n}(-1)^{i-1}(i-1)!\cdot S(n,i)=[n=1]
$$

证明方法：由 $S(n,i)=S(n-1,i-1)+i\cdot S(n-1,i)$，把和式拆成两部分计算。

### 预处理

由递推式可以 $O(n^2)$ 地打一张第二类 Stirling 数的表。

对于固定 $n$, 快速计算前 $m$ 项 $S(n,i)$ 的问题，可以通过上文的通项公式造一个指数生成函数的卷积形式，用 FFT 优化到 $O(m\log m)$。

```cpp
/// @tags: StirlingNumber
#include <algorithm>
#include <cctype>
#include <cstdio>
#include <cstring>
#include <iostream>

using namespace std;

namespace BlueQuantum {

typedef long long ll;

int const N = 1 << 19, P = 167772161, g = 3, ig = 55924054;

class Polynomial {
 private:
  int f[N];

 public:
  void NTT(bool const typ, int const n);
  int *operator&() { return f; }
  int &operator[](int index) { return f[index]; };
  int const &operator[](int index) const { return f[index]; };
} F, G;

int n, m;
int fac[N], inv[N], cvt[N];

inline ll qpow(ll base, int exp) {
  ll Res = 1;
  while (exp) {
    if (exp & 1) Res = Res * base % P;
    base = base * base % P;
    exp >>= 1;
  }
  return Res;
}

/// @param typ 正/逆向 @param n 项数 必须是2的整数次幂
inline void Polynomial::NTT(bool const typ, int const n) {
  for (int i = 1; i < n; ++i)
    if (i < cvt[i]) swap(f[i], f[cvt[i]]);
  for (int i = 2; i <= n; i <<= 1) {
    int mid = i >> 1, wn = qpow(typ ? g : ig, (P - 1) / i);
    for (int j = 0; j < n; j += i) {
      ll wk = 1;
      for (int k = 0; k < mid; ++k, (wk *= wn) %= P) {
        ll t = wk * f[j + k + mid] % P;
        if ((f[j + k + mid] = f[j + k] - t) < 0) f[j + k + mid] += P;
        if ((f[j + k] += t) >= P) f[j + k] -= P;
      }
    }
  }
  if (!typ) {
    ll inv = qpow(n, P - 2);
    for (int i = 0; i < n; ++i) f[i] = inv * f[i] % P;
  }
}

inline int main() {
  cin >> n;
  fac[0] = 1;
  for (int i = 1; i <= n; ++i) fac[i] = 1ll * fac[i - 1] * i % P;
  inv[n] = qpow(fac[n], P - 2);
  for (int i = n - 1; i >= 0; --i) inv[i] = 1ll * inv[i + 1] * (i + 1) % P;
  for (int i = 0; i <= n; ++i) {
    F[i] = qpow(i, n) * inv[i] % P;
    G[i] = (i & 1) ? P - inv[i] : inv[i];
  }
  int maxl = 1;
  while (maxl < n + n + 2) maxl <<= 1;
  for (int i = 1; i <= maxl; ++i) cvt[i] = cvt[i >> 1] >> 1 | ((i & 1) ? maxl >> 1 : 0);
  F.NTT(true, maxl), G.NTT(true, maxl);
  for (int i = 0; i < maxl; ++i) F[i] = 1ll * F[i] * G[i] % P;
  F.NTT(false, maxl);
  for (int i = 0; i <= n; ++i) cout << F[i] << ' ';
  return 0;
}

}  // namespace BlueQuantum

int main() {
#ifndef ONLINE_JUDGE
#ifdef LOCAL
  freopen("/tmp/CodeTmp/testdata.in", "r", stdin);
  freopen("/tmp/CodeTmp/testdata.out", "w", stdout);
#else
  freopen("StirlingNumber.in", "r", stdin);
  freopen("StirlingNumber.out", "w", stdout);
#endif
#endif

  ios::sync_with_stdio(false), cin.tie(NULL), cout.tie(NULL);
  return BlueQuantum::main();
}
```

### 贝尔数

$B_n$ 定义为将 $\{1,2\dots n\}$ 划分为若干非空集合的方案数，计算方法：

$$
B_n=\sum_{i=1}^{n}{n-1\choose i-1}\cdot B_{n-i}
$$

$$
B_n=\sum_{i=0}^{n}S(n,i)
$$

## 两类Stirling数的关系

### 反演公式

首先我们阐述这样两个公式：

$$
\sum_{k=m}^{n}S(n,k)\cdot s(k,m)\cdot (-1)^{n+k}=[n = m]\\
\sum_{k=m}^{n}s(n,k)\cdot S(k,m)\cdot (-1)^{n+k}=[n=m]\\
$$

我们这里简单证明第一个式子，第二个证明比较类似。

注意到：

$$
x^{n}=\sum_{k=0}^{n}S(n,k)\cdot(-1)^{n+k}\cdot x^{k\uparrow}=\sum_{k,m}S(n,k)\cdot s(k,m)\cdot (-1)^{n+k}\cdot x^m
$$

关注上式，因为两边是同一个多项式，右边只能有 $x^n$ 一项系数非零，即可得到结论。

上述两个反演公式说明，如果我们把两类 Stirling 数**带符号**写成方阵，则可以得到它们互为逆矩阵。

由此，我们可以建立 Stirling 数反演公式：

$$
f_i=\sum_{j=0}^{i}S(i,j)\cdot g_j\Leftrightarrow g_i=\sum_{j=0}^{i}(-1)^{i+j}s(i,j)\cdot f_j
$$

## 考点梳理

在算法竞赛里，关于 Stirling 数的考点有两方面：

- 首先，从 Stirling 数的定义出发，可以直接地解决一类计数问题。由 Stirling 数的组合背景，可以用来讨论一些更复杂的“等价类计数”问题，并尝试建立反演公式，加速计算。
- 一个比较“代数”的技巧：两类 Stirling 数建立了一种在自然数的“上升/下降幂”和“通常幂”之间互相转化的方法。